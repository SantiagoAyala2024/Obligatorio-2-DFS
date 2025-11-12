import { useSelector } from 'react-redux'
import { useState } from 'react'
import BtnEliminarSerie from './BtnEliminarSerie'
import BtnEditarSerie from './BtnEditarSerie'
import FiltroFechaSeries from './FiltroFechaSeries'
import { useTranslation } from 'react-i18next'

const ListadoSerie = () => {
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const { t } = useTranslation();
    
    const series = useSelector(state => state.serie?.series) || [];
    const generos = useSelector(state => state.serie?.generos) || [];
    
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

    const seriesFiltradas = (() => {
        if (!fechaInicio && !fechaFin) {
            return series;
        }

        return series.filter(serie => {
            if (!serie.fecha) {
                return false;
            }

            let fechaSerie;
            try {
                if (serie.fecha.includes('T')) {
                    const soloFecha = serie.fecha.split('T')[0];
                    const [año, mes, dia] = soloFecha.split('-');
                    fechaSerie = new Date(año, mes - 1, dia);
                } else {
                    const [año, mes, dia] = serie.fecha.split('-');
                    fechaSerie = new Date(año, mes - 1, dia);
                }
            } catch (error) {
                fechaSerie = new Date(serie.fecha);
            }
            
            if (isNaN(fechaSerie.getTime())) {
                return false;
            }

            if (fechaInicio && fechaSerie < fechaInicio) {
                return false;
            }

            if (fechaFin && fechaSerie > fechaFin) {
                return false;
            }

            return true;
        });
    })();

    return (
        <>
            <FiltroFechaSeries onFiltroChange={handleFiltroFechaChange} />
            
            <div style={{ marginBottom: '15px', color: '#666', fontSize: '0.9rem' }}>
                {t("mostrandoResultadosSeries", { filtradas: seriesFiltradas.length, total: series.length })}
            </div>
            
            <table className="documents-table">
                <thead>
                    <tr>
                        <th>{t("imagen")}</th>
                        <th>{t("nombreSerie")}</th>
                        <th>{t("descripcion")}</th>
                        <th>{t("episodios")}</th>
                        <th>{t("fecha")}</th>
                        <th>{t("generos")}</th>
                        <th>{t("acciones")}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        seriesFiltradas.map((serie, id) => {
                            if (!serie) return null

                            const key = serie._id ?? `serie-${id}`
                            const imagen = serie.url ?? ''
                            const nombre = serie.nombre ?? ''
                            const descripcion = serie.descripcion ?? ''
                            const episodios = serie.episodios ?? ''
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
                            const fecha = formatearFecha(serie.fecha);
                            const generos = convertirGenerosANombres(serie.generos)

                            return (
                                <tr key={key}>
                                    <td><img src={imagen} alt={imagen} style={{ width: '200px', borderRadius: '8px'}} /></td>
                                    <td>{nombre}</td>
                                    <td>{descripcion}</td>
                                    <td>{episodios}</td>
                                    <td>{fecha}</td>
                                    <td>{generos}</td>
                                    <td className="action-buttons">
                                        <BtnEditarSerie serie={serie} />
                                        <BtnEliminarSerie id={serie._id} />
                                    </td>
                                </tr>
                            )
                        })}
                    
                </tbody>
            </table>
        </>    
    )
}

export default ListadoSerie