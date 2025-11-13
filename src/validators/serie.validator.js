import Joi from 'joi';

export const registrarSerieSchema = Joi.object({
    nombre: Joi.string().min(3).max(50).required().messages({
        "string.empty": "El nombre es obligatorio"
    }),
    descripcion: Joi.string().min(3).max(100).required().messages({
        "string.empty": "La descripción es obligatoria"
    }),
    episodios: Joi.number().min(1).required().messages({
        "number.base": "Debe ser un número",
    }),
    fecha: Joi.date().required().messages({
        "date.base": "Fecha inválida"
    }),
    generos: Joi.array().items(Joi.string()).required().messages({
        "array.base": "Selecciona al menos un género"
    }),

    imagen: Joi.any()
        .custom((value, helpers) => {
            if (!value || value.length === 0) {
                return helpers.error("any.required");
            }
            const file = value[0];
            const validTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!validTypes.includes(file.type)) {
                return helpers.error("any.invalid");
            }
            if (file.size > 2 * 1024 * 1024) {
                return helpers.error("any.max");
            }
            return value;
        })
        .messages({
            "any.required": "La imagen es obligatoria",
            "any.invalid": "Archivo inválido (solo JPG, PNG, WEBP)",
            "any.max": "La imagen no puede superar 2MB"
        }),
});

export const actualizarSerieSchema = Joi.object({
   nombre: Joi.string().min(3).max(50).required().messages({
        "string.empty": "El nombre es obligatorio"
    }),
    descripcion: Joi.string().min(3).max(100).required().messages({
        "string.empty": "La descripción es obligatoria"
    }),
    episodios: Joi.number().min(1).required().messages({
        "number.base": "Debe ser un número",
    }),
    fecha: Joi.date().required().messages({
        "date.base": "Fecha inválida"
    }),
    generos: Joi.array().items(Joi.string()).required().messages({
        "array.base": "Selecciona al menos un género"
    }),

    imagen: Joi.any()
        .custom((value, helpers) => {
            if (!value || value.length === 0) {
                return value;
            }
            const file = value[0];
            const validTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!validTypes.includes(file.type)) {
                return helpers.error("any.invalid");
            }
            if (file.size > 2 * 1024 * 1024) {
                return helpers.error("any.max");
            }
            return value;
        })
        .messages({
            "any.invalid": "Archivo inválido (solo JPG, PNG, WEBP)",
            "any.max": "La imagen no puede superar 2MB"
        }),
});