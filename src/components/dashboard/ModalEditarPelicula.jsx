import { joiResolver } from '@hookform/resolvers/joi';
import { useId, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/api';
import { actualizarPelicula } from '../../features/pelicula.slice';
import { actualizarPeliculaSchema } from '../../validators/pelicula.validator'
import { toast } from 'react-toastify';

const ModalEditarPelicula = ({ pelicula, isOpen, onClose }) => {
    const nombrId = useId();
    const descripcionId = useId();
    const duracionId = useId();
    const fechaId = useId();
    const generoId = useId();

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: joiResolver(actualizarPeliculaSchema)
    });

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [imagenUrl, setImagenUrl] = useState("");

    const generos = useSelector(state => state.pelicula?.generos) || [];

    useEffect(() => {
        if (isOpen && pelicula) {
            setValue('nombre', pelicula.nombre || '');
            setValue('descripcion', pelicula.descripcion || '');
            setValue('duracion', pelicula.duracion || '');
            
            if (pelicula.fecha) {
                const fecha = new Date(pelicula.fecha);
                const fechaFormateada = fecha.toISOString().split('T')[0];
                setValue('fecha', fechaFormateada);
            }
            
            setValue('generos', pelicula.generos || []);
        }

    }, [isOpen, pelicula, setValue]);


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

        if (!pelicula?._id) return;
        
        const file = data.imagen[0];

        const url = await subirImagen(file);
            
        if (!url) {
            alert("Error subiendo la imagen");
            return;
        }

        console.log(data);
        setLoading(true);

        const peliculaActualizada = {
            nombre: data.nombre,
            descripcion: data.descripcion,
            duracion: data.duracion,
            fecha: data.fecha,
            generos: data.generos,
            url: url
        };

        try {

            const response = await api.patch(`v1/peliculas/${pelicula._id}`, peliculaActualizada);
            
            //const peliculaConId = {...pelicula, ...peliculaActualizada, _id: pelicula._id, fecha: peliculaActualizada.fecha ? peliculaActualizada.fecha.toString() : pelicula.fecha};
            const peliculaConId = {...pelicula, ...peliculaActualizada, _id: pelicula._id, fecha: peliculaActualizada.fecha || pelicula.fecha};


            dispatch(actualizarPelicula({ pelicula: peliculaConId }));

            toast.success('Película actualizada correctamente');
            onClose();

        } catch (error) {
            console.error('Error al actualizar la película:', error);
            toast.error('Error al actualizar la película. Revisa la consola para más detalles.');
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
                    <h2 className="modal-title">Editar Película</h2>
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
                            <label htmlFor={duracionId}>Duración (minutos)</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                id={duracionId} 
                                {...register("duracion")} 
                            />
                            <span className="error">{errors.duracion?.message}</span>
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
                            <label>Imagen</label>
                            <input type="file" accept="image/*" {...register("imagen")} />
                            <span className="error">{errors.imagen?.message}</span>

                            {loading && <p>Subiendo imagen...</p>}

                            {imagenUrl && (
                                <div style={{ marginTop: "10px" }}>
                                    <img src={imagenUrl.replace('/upload/', '/upload/c_scale,w_300/f_auto/q_auto/')} alt="preview" width="200"/>
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
                                    'Actualizar Película'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalEditarPelicula;