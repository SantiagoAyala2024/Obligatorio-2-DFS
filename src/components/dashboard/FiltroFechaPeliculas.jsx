import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const FiltroFechaPeliculas = ({ onFiltroChange }) => {
    const { t } = useTranslation();
    const [tipoFiltro, setTipoFiltro] = useState('todo');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    const calcularFecha = (tipo) => {
        const hoy = new Date();
        const fechas = {
            inicio: null,
            fin: hoy
        };

        switch (tipo) {
            case 'semana':
                fechas.inicio = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'mes':
                fechas.inicio = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case 'manual':
                fechas.inicio = fechaInicio ? new Date(fechaInicio) : null;
                fechas.fin = fechaFin ? new Date(fechaFin) : hoy;
                break;
            case 'todo':
            default:
                fechas.inicio = null;
                fechas.fin = null;
                break;
        }

        return fechas;
    };

    const handleTipoFiltroChange = (e) => {
        const nuevoTipo = e.target.value;
        setTipoFiltro(nuevoTipo);
        
        const fechas = calcularFecha(nuevoTipo);
        onFiltroChange(fechas.inicio, fechas.fin);
    };

    const handleFechaManualChange = () => {
        if (tipoFiltro === 'manual') {
            const fechas = calcularFecha('manual');
            onFiltroChange(fechas.inicio, fechas.fin);
        }
    };

    const handleFechaInicioChange = (e) => {
        setFechaInicio(e.target.value);
        setTimeout(handleFechaManualChange, 10);
    };

    const handleFechaFinChange = (e) => {
        setFechaFin(e.target.value);
        setTimeout(handleFechaManualChange, 10);
    };

    return (
        <div className="document-filters">
            <div className="filter-group">
                <label>{t('filtrarPorPeriodo')}</label>
                <select 
                    className="form-control" 
                    value={tipoFiltro}
                    onChange={handleTipoFiltroChange}
                >
                    <option value="todo">{t('todoHistorico')}</option>
                    <option value="semana">{t('ultimaSemana')}</option>
                    <option value="mes">{t('ultimoMes')}</option>
                    <option value="manual">{t('rangoPersonalizado')}</option>
                </select>
            </div>
            
            {tipoFiltro === 'manual' && (
                <div className="filter-group">
                    <label>{t('rangoFechas')}</label>
                    <div className="date-inputs">
                        <input 
                            type="date" 
                            className="form-control" 
                            placeholder={t('fechaInicio')}
                            value={fechaInicio}
                            onChange={handleFechaInicioChange}
                        />
                        <input 
                            type="date" 
                            className="form-control" 
                            placeholder={t('fechaFin')}
                            value={fechaFin}
                            onChange={handleFechaFinChange}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FiltroFechaPeliculas;