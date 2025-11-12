import { joiResolver } from '@hookform/resolvers/joi';
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/api';
import { guardarPelicula } from '../../features/pelicula.slice';
import { registrarPeliculaSchema } from '../../validators/pelicula.validator'
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const FormPelicula = () => {

    const nombrId = useId();
    const descripcionId = useId();
    const duracionId = useId();
    const fechaId = useId();
    const generoId = useId();

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: joiResolver(registrarPeliculaSchema)
    });

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [imagenUrl, setImagenUrl] = useState("");
    const { t } = useTranslation();

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

    const generos = useSelector(state => state.pelicula?.generos);

    const onSubmit = async (data) => {
        
        const file = data.imagen[0];

        const url = await subirImagen(file);
            
        if (!url) {
            alert("Error subiendo la imagen");
            return;
        }

        console.log(data);
        setLoading(true);

        const pelicula = {
            nombre: data.nombre,
            descripcion: data.descripcion,
            duracion: data.duracion,
            fecha: data.fecha,
            generos: data.generos,
            url: url
        }

        api.post("v1/peliculas", pelicula)
        .then((response) => {
            if (response.data) {
               dispatch(guardarPelicula(response.data));
               toast.success("Película registrada correctamente");
               reset(); 
            }
        })
        .catch((error) => {
            console.error(error);
            toast.error("Error al registrar la película");
        }).finally(() => {
            setLoading(false);
        });
    };
    
    return (
        <div className="document-form">
            <h3 className="form-subtitle">{t("registrarPelicula")}</h3>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor={nombrId}>{t("registrarPelicula")}</label>
                    <input type="text" className="form-control" id={nombrId} {...register("nombre")} />
                    <span className="error">{errors.nombre?.message}</span>
                </div>

                <div className="form-group">
                    <label htmlFor={descripcionId}>{t("nombrePelicula")}</label>
                    <input type="text" className="form-control" id={descripcionId} {...register("descripcion")} />
                    <span className="error">{errors.descripcion?.message}</span>
                </div>
            
                <div className="form-group">
                    <label htmlFor={duracionId}>{t("duracion")}</label>
                    <input type="number" className="form-control" id={duracionId} {...register("duracion")} />
                    <span className="error">{errors.episodios?.message}</span>
                </div>

                <div className="form-group">
                    <label htmlFor={fechaId}>{t("fecha")}</label>
                    <input type="date" className="form-control" id={fechaId} {...register("fecha")} />
                    <span className="error">{errors.fecha?.message}</span>
                </div>

                <div className="form-group">
                    <label htmlFor={generoId}>{t("generos")}</label>
                    <select className="form-control" id={generoId} multiple {...register("generos")} defaultValue={[]}>
                        {generos && generos.length > 0 ? ( 
                            generos.map((genero) => ( 
                                <option key={genero._id} value={genero._id}>{genero.nombre}</option>
                            ))
                        ) : (
                            <option value="">{t("noHayGeneros")}</option>
                        )}
                    </select> 
                </div>

                <div className="form-group">
                    <label>{t("imagen")}</label>
                    <input type="file" accept="image/*" {...register("imagen")} />
                    <span className="error">{errors.imagen?.message}</span>

                    {loading && <p>Subiendo imagen...</p>}

                    {imagenUrl && (
                        <div style={{ marginTop: "10px" }}>
                            <img src={imagenUrl.replace('/upload/', '/upload/c_scale,w_300/f_auto/q_auto/')} alt="preview" width="200"/>
                        </div>
                    )}

                </div>

                <button className="btn btn-primary">{loading ? <i className="fas fa-spinner fa-spin" /> : t("registrarPeliculaBtn")}</button>

            </form>
        </div>
    )
}

export default FormPelicula