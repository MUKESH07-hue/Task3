const Joi = require('joi');


const registerValidation = (input) => {
    const schema = Joi.object({
        Username: Joi.string().alphanum().min(3).max(20).required(),
        PhoneNumber: Joi.string().min(10).max(10).required(),
        Email: Joi.string().email().required(),
        Password: Joi.string().alphanum().min(8).max(10).required()
    })
    return schema.validate(input);
}

const loginValidation = (input) => {
    const schema = Joi.object({
        Username: Joi.string().alphanum().min(3).max(20).required(),
        Password: Joi.string().alphanum().min(8).max(10).required()
    })
    return schema.validate(input);
}

const updateValidation = (input) => {
    const schema = Joi.object({
        Username: Joi.string().alphanum().min(3).max(20).required(),
        PhoneNumber: Joi.string().min(10).max(10).required(),
        Email: Joi.string().email().required(),
        Password: Joi.string().alphanum().min(8).max(10).required()
    })
    return schema.validate(input);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.updateValidation = updateValidation;