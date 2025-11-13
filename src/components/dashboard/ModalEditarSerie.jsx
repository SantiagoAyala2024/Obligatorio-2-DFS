import { joiResolver } from '@hookform/resolvers/joi';
import { useId, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/api';
import { actualizarSerie } from '../../features/serie.slice';
import { registrarSerieSchema } from '../../validators/serie.validator'
import { toast } from 'react-toastify';

const ModalEditarSerie = ({ serie, isOpen, onClose }) => {
    const nombrId = useId();
    const descripcionId = useId();
    const episodiosId = useId();
    const fechaId = useId();
    const generoId = useId();

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: joiResolver(registrarSerieSchema)
    });

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [imagenUrl, setImagenUrl] = useState("");

    const generos = useSelector(state => state.serie?.generos) || [];

    useEffect(() => {
        if (isOpen && serie) {
            setValue('nombre', serie.nombre || '');
            setValue('descripcion', serie.descripcion || '');
            setValue('episodios', serie.episodios || '');
            
            if (serie.fecha) {
                const fecha = new Date(serie.fecha);
                const fechaFormateada = fecha.toISOString().split('T')[0];
                setValue('fecha', fechaFormateada);
            }
            
            setValue('generos', serie.generos || []);
        }

    }, [isOpen, serie, setValue]);

    const subirImagen = async (file) => {

        setLoading(true);
        setImagenUrl("");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "develotion");
        formData.append("cloud_name", "djiawpmq4");

        try {

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/djiawpmq4/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();
            setImagenUrl(data.secure_url);
            return data.secure_url;

        } catch (err) {

            console.error("Error al subir imagen:", err);
            return null;

        } finally {

            setLoading(false);
        }
    };


    const onSubmit = async (data) => {
        
        if (!serie?._id) return;
        
        setLoading(true);

        let url = serie.url;
        
        if (data.imagen && data.imagen.length > 0 && data.imagen[0]) {
            const file = data.imagen[0];
            const nuevaUrl = await subirImagen(file);
            
            if (!nuevaUrl) {
                alert("Error subiendo la imagen");
                setLoading(false);
                return;
            }
            url = nuevaUrl;
        }


        const serieActualizada = {
            nombre: data.nombre,
            descripcion: data.descripcion,
            episodios: data.episodios,
            fecha: data.fecha,
            generos: data.generos,
            url: url
        };

        try {
            const response = await api.patch(`v1/series/${serie._id}`, serieActualizada);
            
            const serieConId = {...serie, ...serieActualizada, _id: serie._id, fecha: serieActualizada.fecha ? serieActualizada.fecha.toString() : serie.fecha};

            dispatch(actualizarSerie({ serie: serieConId }));

            try {
                const peliculasSeriesResponse = await api.get('v1/usuarios/peliculas-series');
                if (peliculasSeriesResponse.data) {
                    const { guardarSeries } = await import('../../features/serie.slice');
                    dispatch(guardarSeries(peliculasSeriesResponse.data.series));
                }
            } catch (reloadError) {
                console.warn('Error recargando datos:', reloadError);
            }

            toast.success('Serie actualizada correctamente');
            onClose();

        } catch (error) {
            console.error('Error al actualizar la serie:', error);
            toast.error('Error al actualizar la serie. Revisa la consola para más detalles.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Editar Serie</h2>
                    <button 
                        className="modal-close" 
                        onClick={handleClose}
                        type="button"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                <div className="modal-body">
                    <form className="modal-form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label htmlFor={nombrId}>Nombre</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id={nombrId} 
                                {...register("nombre")} 
                            />
                            <span className="error">{errors.nombre?.message}</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor={descripcionId}>Descripción</label>
                            <textarea 
                                className="form-control" 
                                id={descripcionId} 
                                rows="3"
                                {...register("descripcion")} 
                            />
                            <span className="error">{errors.descripcion?.message}</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor={episodiosId}>Número de Episodios</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                id={episodiosId} 
                                {...register("episodios")} 
                            />
                            <span className="error">{errors.episodios?.message}</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor={fechaId}>Fecha de Estreno</label>
                            <input 
                                type="date" 
                                className="form-control" 
                                id={fechaId} 
                                {...register("fecha")} 
                            />
                            <span className="error">{errors.fecha?.message}</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor={generoId}>Géneros</label>
                            <select 
                                className="form-control" 
                                id={generoId} 
                                multiple 
                                {...register("generos")}
                            >
                                {generos.length > 0 ? ( 
                                    generos.map((genero) => ( 
                                        <option key={genero._id} value={genero._id}>
                                            {genero.nombre}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">No hay géneros disponibles</option>
                                )}
                            </select>
                            <span className="error">{errors.generos?.message}</span>
                        </div>

                        <div className='form-group'>
                            <label>Imagen {serie?.url && <span style={{color: '#666', fontSize: '0.9rem'}}>(opcional - deja vacío para mantener la actual)</span>}</label>
                            {serie?.url && (
                                <div style={{ marginBottom: "15px" }}>
                                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '8px' }}>Imagen actual:</p>
                                    <img 
                                        src={serie.url.replace('/upload/', '/upload/c_scale,w_200/f_auto/q_auto/')} 
                                        alt="Imagen actual" 
                                        width="150"
                                        style={{ borderRadius: '8px', border: '1px solid #ddd' }}
                                    />
                                </div>
                            )}
                            <input type="file" accept="image/*" {...register("imagen")} />
                            <span className="error">{errors.imagen?.message}</span>

                            {loading && <p>Subiendo imagen...</p>}

                            {imagenUrl && (
                                <div style={{ marginTop: "10px" }}>
                                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '8px' }}>Nueva imagen:</p>
                                    <img src={imagenUrl.replace('/upload/', '/upload/c_scale,w_200/f_auto/q_auto/')} alt="preview" width="150" style={{ borderRadius: '8px', border: '1px solid #ddd' }}/>                                
                                </div>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i> Actualizando...
                                    </>
                                ) : (
                                    'Actualizar Serie'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalEditarSerie;