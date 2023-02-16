const Joi = require('joi')
const options = {
    // remove " " in message
    errors: {
      wrap: {
        label: ''
      }
    },
    abortEarly:false // to show all error message
  };

// const registerValidation = (data) => {
//     const schema = Joi.object({
//         firstname: Joi.string()
//             .min(3)
//             .max(15)
//             .required(),
//         lastname: Joi.string()
//             .min(3)
//             .max(15)
//             .required(),
//         username: Joi.string()
//             .min(6)
//             .required(),
//         password: Joi.string()
//             .min(6)
//             .required(),
//     });
//     return schema.validate(data);
// };

const adminRegisterValidation = (data) => {
    const schema = Joi.object({
      username: Joi.string()
        .min(5)
        .required(),
      password: Joi.string()
        .min(6)
        .required(),
      firstname: Joi.string()
        .min(6)
        .required(),
      lastname: Joi.string()
        .min(6)
        .required()
    });
    return schema.validate(data,options);
};

module.exports = {adminRegisterValidation}