import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import { desloguear } from '../../features/auth.slice';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const Contenedor = () => {

    const logueado = useSelector(state => Boolean(state.auth.token));
    const [idioma, setIdioma] = useState('es');

    const { t, i18n } = useTranslation();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cerrarSesion = () => {
        dispatch(desloguear());
        toast.success("Sesión cerrada correctamente");
        navigate('/');
    }

    const cambiarIdioma = e => {
        const idioma = e.target.value;
        i18n.changeLanguage(idioma);
    }

    return (
        <>
            <header className="main-header">
                <div className="header-content">
                    <a className="app-logo"><span>{t("nombre")}</span></a>
                    <select value={i18n.language} onChange={cambiarIdioma}>
                        <option value="es">ES</option>
                        <option value="en">EN</option>
                    </select>
                    {logueado && (
                        <button className="logout-btn" onClick={cerrarSesion} title={t("cerrarSesion")}>
                            <i className="fas fa-sign-out-alt"></i>
                        </button>
                    )}
                </div>
            </header>
           
            <Outlet />
        </>
    )
}

export default Contenedor