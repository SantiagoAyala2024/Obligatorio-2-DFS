import Joi from 'joi';

export const usuarioSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        'string.empty': 'El nombre de usuario es requerido',
        'string.min': 'El nombre de usuario debe tener al menos 3 caracteres',
        'string.max': 'El nombre de usuario no puede exceder los 30 caracteres',
        'any.required': 'El nombre de usuario es requerido'
    }),
    name: Joi.string().min(3).max(30).required().messages({
        'string.empty': 'El nombre es requerido',
        'string.min': 'El nombre debe tener al menos 3 caracteres',
        'string.max': 'El nombre no puede exceder los 30 caracteres',
        'any.required': 'El nombre es requerido'
    }),
    lastname: Joi.string().min(3).max(30).required().messages({
        'string.empty': 'El apellido es requerido',
        'string.min': 'El apellido debe tener al menos 3 caracteres',
        'string.max': 'El apellido no puede exceder los 30 caracteres',
        'any.required': 'El apellido es requerido'
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'El correo electrónico es requerido',
        'string.email': 'Debe proporcionar un correo electrónico válido',
        'any.required': 'El correo electrónico es requerido'
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'La contraseña es requerida',
        'string.min': 'La contraseña debe tener al menos 6 caracteres',
        'any.required': 'La contraseña es requerida'
    }),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
        'string.empty': 'Debe confirmar la contraseña',
        'any.only': 'Las contraseñas no coinciden',
        'any.required': 'La confirmación de contraseña es requerida'
    }),
    plan: Joi.string().required().messages({
        'any.required': 'El plan es requerido'
    })
});

export const loginUsuarioSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        'string.empty': 'El nombre de usuario es requerido',
        'string.min': 'El nombre de usuario debe tener al menos 3 caracteres',
        'string.max': 'El nombre de usuario no puede exceder los 30 caracteres',
        'any.required': 'El nombre de usuario es requerido'
    }),
    password: Joi.string().required().messages({
        'any.required': 'La contraseña es requerida'
    })
});

    