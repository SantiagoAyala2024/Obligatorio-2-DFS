import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux'
import GraficaBarras from './GraficaBarras'

const Grafica = () => {

    const peliculas = useSelector(state => state.pelicula?.peliculas) || [];
    const series = useSelector(state => state.serie?.series) || [];
    const { t } = useTranslation();
    const totalPeliculas = peliculas.length;
    const totalSeries = series.length;
    const totalContenido = totalPeliculas + totalSeries;

    return (
        <div className="content-card">
            <h2 className="section-title">{t('estadisticasContenido')}</h2>
            <div className="stats-grid">
                <GraficaBarras peliculas={peliculas} series={series} />
                <div className="stats-summary">
                    <div className="stat-card">
                        <h4>{t('totalPeliculas')}</h4>
                        <div className="stat-number">{totalPeliculas}</div>
                    </div>
                    <div className="stat-card">
                        <h4>{t('totalSeries')}</h4>
                        <div className="stat-number">{totalSeries}</div>
                    </div>
                    <div className="stat-card">
                        <h4>{t('totalContenido')}</h4>
                        <div className="stat-number">{totalContenido}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Grafica