import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import api from '../../api/api';
import { useDispatch } from 'react-redux';
import { useId, useState } from 'react';
import { joiResolver } from '@hookform/resolvers/joi';
import { loguear } from '../../features/auth.slice';
import { loginUsuarioSchema } from '../../validators/usuario.validator';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const Login = () => {

    const usernameId = useId();
    const passwordId = useId();

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: joiResolver(loginUsuarioSchema)
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const username = watch("username");
    const password = watch("password");
    const ingresar = Boolean(username && password);

    const onSubmit = (data) => {
        
        console.log(data);
        setLoading(true);

        const usuarioLogueado = {
            username: data.username,
            password: data.password
        }

        api.post("v1/auth/login", usuarioLogueado) 
        .then((response) => {
            dispatch(loguear({token: response.data.token}));
            navigate('/dashboard');
            toast.success("Usuario loguado correctamente");
        })
        .catch((error) => {
            console.error(error);
            toast.error("Usuario o contraseña incorrectos");
        }).finally(() => {
            setLoading(false);
        });  
    };

    return (
        <div className="container auth-container">
            <header>
                <h1>{t("login")}</h1>
            </header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor={usernameId}>{t("nombreUsuario")}</label>
                    <input type="text" id={usernameId} name="username" {...register("username")} />
                    <span className="error">{errors.username?.message}</span>
                </div>

                <div className="form-group">
                    <label htmlFor={passwordId}>{t("contraseña")}</label>
                    <input type="password" id={passwordId} name="password" {...register("password")} />
                    <span className="error">{errors.password?.message}</span>
                </div>

                <button disabled={!ingresar}>{loading ? <i className="fas fa-spinner fa-spin" /> : t("iniciarSesion")}</button>
                
                <div className="register-link">
                    {t("aviso")} <Link to="/registro">{t("registro")}</Link>
                </div>
            </form>
        </div>
    )
}

export default Login