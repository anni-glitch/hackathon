const Joi = require('joi');

const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    return schema.validate(data);
};

const validateCase = (data) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        type: Joi.string().required(),
        filing_date: Joi.date().required(),
        urgency_score: Joi.number().min(1).max(10),
        lawyerId: Joi.string().guid({ version: 'uuidv4' }),
        litigantId: Joi.string().guid({ version: 'uuidv4' })
    });
    return schema.validate(data);
};

module.exports = {
    validateLogin,
    validateCase
};
