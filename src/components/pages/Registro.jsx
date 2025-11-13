import { joiResolver } from '@hookform/resolvers/joi';
import { useId, useState } from 'react';
import { useForm } from 'react-hook-form'
import { usuarioSchema } from '../../validators/usuario.validator';
import api from '../../api/api';
import { Link, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { loguear } from '../../features/auth.slice';
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";

const Registro = () => {

    const usernameId = useId();
    const nameId = useId();
    const lastnameId = useId();
    const emailId = useId();
    const passwordId = useId();
    const confirmPasswordId = useId();

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: joiResolver(usuarioSchema)
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    
    const confirmPassword = watch("confirmPassword");
    const password = watch("password");
    const ingresar = Boolean(confirmPassword === password);

    const onSubmit = (data) => {
        
        setLoading(true);

        const usuario = {
            username: data.username,
            name: data.name,
            lastname: data.lastname,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
            plan: data.plan
        }

        api.post("v1/auth/register", usuario)
        .then((response) => {
            localStorage.setItem("token", response.data.token);
            dispatch(loguear({token: response.data.token}));
            navigate('/dashboard');
            toast.success("Usuario registrado correctamente");
        })
        .catch((error) => {
            console.error(error);
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <div className="container auth-container">
            <header>
                <h1>{t("crearCuenta")}</h1>
            </header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor={usernameId}>{t("nombreUsuario")}</label>
                    <input type="text" id={usernameId} name="username" autoComplete='username' {...register("username")} />
                    <span className="error">{errors.username?.message}</span>
                </div>

                <div className="form-group">
                    <label htmlFor={nameId}>{t("nombreRegistro")}</label>
                    <input type="text" id={nameId} name="name" autoComplete='name' {...register("name")} />
                    <span className="error">{errors.name?.message}</span>
                </div>

                <div className="form-group">
                    <label htmlFor={lastnameId}>{t("apellido")}</label>
                    <input type="text" id={lastnameId} name="lastname" {...register("lastname")} />
                    <span className="error">{errors.lastname?.message}</span>
                </div>

                <div className="form-group">
                    <label htmlFor={emailId}>{t("correo")}</label>
                    <input type="email" id={emailId} name="email" autoComplete='email' {...register("email")} />
                    <span className="error">{errors.email?.message}</span>
                </div>

                <div className="form-group">
                    <label htmlFor={passwordId}>{t("contraseña")}</label>
                    <input type="password" id={passwordId} name="password" {...register("password")} />
                    <span className="error">{errors.password?.message}</span>
                </div>

                <div className="form-group">
                    <label htmlFor={confirmPasswordId}>{t("confirmarContraseña")}</label>
                    <input type="password" id={confirmPasswordId} name="confirmPassword" {...register("confirmPassword")} />
                    <span className="error">{errors.confirmPassword?.message}</span>
                </div>

                <div className="form-group">
                    <input type="hidden" value="68db13885ac24b2ced2e65af" {...register("plan")} />
                </div>

                <button disabled={!ingresar}>{loading ? <i className="fas fa-spinner fa-spin" /> : t("registrarse")}</button>

                <div className="login-link">
                    {t("yaTienesCuenta")} <Link to="/">{t("login")}</Link>
                </div>

            </form>
        </div>
    )
}

export default Registro