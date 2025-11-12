import { useTranslation } from 'react-i18next';

const GraficaBarras = ({ peliculas = [], series = [] }) => {
 
    const { t } = useTranslation();
    
    const agruparPorMes = (contenido) => {
    const meses = {};
      
    contenido.forEach(item => {
    if (!item.fecha) return;
        
        try {
          let fecha;
          if (item.fecha.includes('T')) {
            const soloFecha = item.fecha.split('T')[0];
            const [año, mes, dia] = soloFecha.split('-');
            fecha = new Date(año, mes - 1, dia);
          } else {
            const [año, mes, dia] = item.fecha.split('-');
            fecha = new Date(año, mes - 1, dia);
          }
          
          const mesAño = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
          
          if (!meses[mesAño]) {
            meses[mesAño] = 0;
          }
          meses[mesAño]++;
        } catch (error) {
          console.warn('Error procesando fecha para gráfica:', item.fecha);
        }
      });
      
      return meses;
    };

  const peliculasPorMes = agruparPorMes(peliculas);
  const seriesPorMes = agruparPorMes(series);
  
  const añoActual = new Date().getFullYear();
  const todosMesesDelAño = [];
  
  for (let mes = 1; mes <= 12; mes++) {
    const mesFormateado = `${añoActual}-${String(mes).padStart(2, '0')}`;
    todosMesesDelAño.push(mesFormateado);
  }
  
  const mesesOrdenados = todosMesesDelAño;
  
  const formatearMes = (mesAño) => {
    const [año, mes] = mesAño.split('-');
    const fecha = new Date(año, mes - 1, 1);
    return fecha.toLocaleDateString('es-ES', { 
        month: 'short'  
    });
  };

  const maxValue = Math.max(...mesesOrdenados.map(mes => Math.max(peliculasPorMes[mes] || 0, seriesPorMes[mes] || 0)));

  return (
    <div className="chart-container">
      {true ? ( 
        <div>
            <h3 style={{ 
            color: '#273c75', 
            marginBottom: '15px', 
            textAlign: 'center',
            marginTop: '20px' 
          }}>
            {t('peliculasYSeriesPorMes')}
          </h3>
        
          <div style={{ 
            display: 'flex', 
            alignItems: 'end', 
            height: '280px', 
            gap: '8px',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '10px',
            backgroundColor: '#f9f9f9',
            overflowX: 'auto' 
          }}>
            {mesesOrdenados.map(mes => {
              const peliculas = peliculasPorMes[mes] || 0;
              const series = seriesPorMes[mes] || 0;
              const total = peliculas + series;
              
              return (
                <div key={mes} style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  flex: 1,
                  minWidth: '50px',
                  maxWidth: '80px'
                }}>
                 
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'end', 
                    height: '220px', 
                    gap: '4px'
                  }}>
                    
                      <div
                      style={{
                        width: '16px',
                        height: `${maxValue > 0 ? (peliculas / maxValue) * 220 : 2}px`,
                        backgroundColor: peliculas > 0 ? '#273c75' : '#e0e0e0',
                        borderRadius: '3px 3px 0 0',
                        position: 'relative'
                      }}
                      title={`${peliculas} ${t('peliculas')}`}
                    >
                      {peliculas > 0 && (
                        <span style={{
                          position: 'absolute',
                          top: '-18px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '9px',
                          color: '#273c75',
                          fontWeight: 'bold'
                        }}>
                          {peliculas}
                        </span>
                      )}
                    </div>
                    
                    <div
                      style={{
                        width: '16px',
                        height: `${maxValue > 0 ? (series / maxValue) * 220 : 2}px`,
                        backgroundColor: series > 0 ? '#fbc531' : '#f0f0f0',
                        borderRadius: '3px 3px 0 0',
                        position: 'relative'
                      }}
                      title={`${series} ${t('series')}`}
                    >
                      {series > 0 && (
                        <span style={{
                          position: 'absolute',
                          top: '-20px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '10px',
                          color: '#fbc531',
                          fontWeight: 'bold'
                        }}>
                          {series}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ 
                    marginTop: '8px', 
                    fontSize: '10px', 
                    color: '#666',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    fontWeight: '500'
                  }}>
                    {formatearMes(mes)}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px', 
            marginTop: '15px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ 
                width: '15px', 
                height: '15px', 
                backgroundColor: '#273c75',
                borderRadius: '3px'
              }}></div>
                  <span style={{ fontSize: '14px', color: '#273c75' }}>{t('peliculas')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ 
                width: '15px', 
                height: '15px', 
                backgroundColor: '#fbc531',
                borderRadius: '3px'
              }}></div>
                  <span style={{ fontSize: '14px', color: '#fbc531' }}>{t('series')}</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '250px',
          color: '#666',
          fontFamily: 'Nunito'
        }}>
          <div style={{ textAlign: 'center' }}>
            <i className="fas fa-chart-bar" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}></i>
                <p>{t('noHayDatosGrafica')}</p>
                <small>{t('registraParaVerEstadisticas')}</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraficaBarras;