import { useSelector } from 'react-redux'
import { useState } from 'react'
import BtnEliminarPelicula from './BtnEliminarPelicula'
import BtnEditarPelicula from './BtnEditarPelicula'
import FiltroFechaPeliculas from './FiltroFechaPeliculas'
import { useTranslation } from 'react-i18next'

const ListadoPelicula = () => {
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const { t } = useTranslation();
    
    const peliculas = useSelector(state => state.pelicula?.peliculas) || [];
    const generos = useSelector(state => state.pelicula?.generos) || [];
    

    const convertirGenerosANombres = (generosIds) => {
        if (!generosIds) return '';
        
        if (Array.isArray(generosIds)) {
            return generosIds.map(generoId => {
                const genero = generos.find(gen => gen._id === generoId);
                return genero ? genero.nombre : generoId;
            }).join(', ');
        }
        
        const genero = generos.find(gen => gen._id === generosIds);
        return genero ? genero.nombre : generosIds;
    };

    const handleFiltroFechaChange = (inicio, fin) => {
        setFechaInicio(inicio);
        setFechaFin(fin);
    };

    const peliculasFiltradas = (() => {
        if (!fechaInicio && !fechaFin) {
            return peliculas;
        }

        return peliculas.filter(pelicula => {
            if (!pelicula.fecha) {
                return false;
            }

            let fechaPelicula;
            try {

                /*if (pelicula.fecha.includes('T')) {
                    const soloFecha = pelicula.fecha.split('T')[0];
                    const [año, mes, dia] = soloFecha.split('-');
                    fechaPelicula = new Date(año, mes - 1, dia);
                } else {
                    const [año, mes, dia] = pelicula.fecha.split('-');
                    fechaPelicula = new Date(año, mes - 1, dia);
                }
                */
                if (pelicula.fecha instanceof Date) {
                    fechaPelicula = pelicula.fecha;
                }
                else if (typeof pelicula.fecha === 'string') {
                    if (pelicula.fecha.includes('T')) {
                        const soloFecha = pelicula.fecha.split('T')[0];
                        const [año, mes, dia] = soloFecha.split('-');
                        fechaPelicula = new Date(año, mes - 1, dia);
                    } else {
                        const [año, mes, dia] = pelicula.fecha.split('-');
                        fechaPelicula = new Date(año, mes - 1, dia);
                    }
                }
                else {
                    fechaPelicula = new Date(pelicula.fecha);
                }

            } catch (error) {
                fechaPelicula = new Date(pelicula.fecha);
            }
            
            if (isNaN(fechaPelicula.getTime())) {
                return false;
            }

            if (fechaInicio && fechaPelicula < fechaInicio) {
                return false;
            }

            if (fechaFin && fechaPelicula > fechaFin) {
                return false;
            }

            return true;
        });
    })();

    return (
        <>
            <FiltroFechaPeliculas onFiltroChange={handleFiltroFechaChange} />
            
            <div style={{ marginBottom: '15px', color: '#666', fontSize: '0.9rem' }}>
                {t("mostrandoResultados", { filtradas: peliculasFiltradas.length, total: peliculas.length })}
            </div>
            
            <table className="documents-table">
                <thead>
                    <tr>
                        <th>{t("imagen")}</th>
                        <th>{t("nombrePelicula")}</th>
                        <th>{t("descripcion")}</th>
                        <th>{t("duracion")}</th>
                        <th>{t("fecha")}</th>
                        <th>{t("generos")}</th>
                        <th>{t("acciones")}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        peliculasFiltradas.map((pelicula, id) => {

                            if (!pelicula) return null

                            const key = pelicula._id ?? `pelicula-${id}`
                            const imagen = pelicula.url ?? ''
                            const nombre = pelicula.nombre ?? ''
                            const descripcion = pelicula.descripcion ?? ''
                            const duracion = pelicula.duracion ?? ''
                            
                            const formatearFecha = (fechaStr) => {
                                if (!fechaStr) return '';
                                
                                try {
                                    
                                    let fecha;
                                    if (fechaStr.includes('T')) {
                                       
                                        const soloFecha = fechaStr.split('T')[0];
                                        const [año, mes, dia] = soloFecha.split('-');
                                        fecha = new Date(año, mes - 1, dia);
                                    } else {
                                        const [año, mes, dia] = fechaStr.split('-');
                                        fecha = new Date(año, mes - 1, dia);
                                    }
                                    
                                    if (isNaN(fecha.getTime())) {
                                        return 'Fecha inválida';
                                    }
                                    
                                    return fecha.toLocaleDateString();
                                } catch (error) {
                                    console.error('Error al formatear fecha:', fechaStr, error);
                                    return 'Fecha inválida';
                                }
                            };
                            const fecha = formatearFecha(pelicula.fecha);
                            const generos = convertirGenerosANombres(pelicula.generos)

                            return (
                                <tr key={key}>
                                    <td><img src={imagen} alt={imagen} style={{ width: '200px', borderRadius: '8px'}} /></td>
                                    <td>{nombre}</td>
                                    <td>{descripcion}</td>
                                    <td>{duracion}</td>
                                    <td>{fecha}</td>
                                    <td>{generos}</td>
                                    <td className="action-buttons">
                                        <BtnEditarPelicula pelicula={pelicula} />
                                        <BtnEliminarPelicula id={pelicula._id} />
                                    </td>
                                </tr>
                            )
                        })}
                    
                </tbody>
            </table>
        </>    
    )
}

export default ListadoPelicula