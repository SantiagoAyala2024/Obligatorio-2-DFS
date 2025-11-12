import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FormPelicula from './FormPelicula'
import FormSerie from './FormSerie'
import ListadoPelicula from './ListadoPelicula'
import ListadoSerie from './ListadoSerie'
import Grafica from './Grafica'
import api from '../../api/api'
import { guardarCategorias } from '../../features/categoria.slice'
import { guardarPeliculas, guardarGeneros } from '../../features/pelicula.slice'
import { guardarSeries, guardarGeneros as guardarGenerosSerie } from '../../features/serie.slice'
import { guardarUsuarios } from '../../features/usuario.slice'
import { useTranslation } from 'react-i18next'

const Formularios = () => {

    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        api.get(`v1/categorias/`)
            .then((response) => {   
                dispatch(guardarCategorias(response.data));
                dispatch(guardarGeneros(response.data));
                dispatch(guardarGenerosSerie(response.data));

                api.get(`v1/usuarios/`)
                    .then((response) =>{
                        dispatch(guardarUsuarios(response.data));
                    })
                    .catch(error => {
                        console.log("Error al obtener los usuarios", error);
                    })

                    api.get(`v1/usuarios/peliculas-series`)
                        .then((response) => {
                            dispatch(guardarPeliculas(response.data.peliculas));
                            dispatch(guardarSeries(response.data.series));
                        })
                        .catch(error => {
                            console.log("Error al obtener las peliculas o series", error)
                        })
            })
            .catch(error => {
                console.log('Error al obtener las categorias', error);
            });
    }, []);

    return (
        <div className="main-content">
            <div className="content-card">
                <h2 className="document-form">{t("nuevoDocumento")}</h2>
                <div className="document-forms">
                    <FormPelicula />
                    <FormSerie />
                </div>
            </div>
            <div className="content-card">
                <h2 className="section-title">{t("misPeliculas")}</h2>
                	<ListadoPelicula /> 
            </div>
            <div className="content-card">
                <h2 className="section-title">{t("misSeries")}</h2> 
                <ListadoSerie />        
            </div>
            <Grafica /> 
        </div>
    )
}

export default Formularios