const Joi = require("joi");

//::::::::::::::::::::: COMMON ATTRIBUTS ::::::::::::::::::::://

const email = Joi.string().trim().email().not(Joi.ref("password")).messages({
  "any.invalid": "username and password must be different",
});

const username = Joi.string().trim().lowercase().alphanum().min(3).max(30);
const password = Joi.string().alphanum().min(4).max(30);

//.not(Joi.ref("password")).messages({"any.invalid": "username and password must be different",})


//::::::::::::::::::::: VALIDATION SCHEMA ::::::::::::::::::::://

const registerValidator = Joi.object({
  password: password.required(),
  username: username.required(),
  repeat_password: Joi.string().valid(Joi.ref("password")).required(),
});

const loginValidator = Joi.object({
  password: Joi.string().trim().required(),
  username: Joi.string().trim().required(),
})

const updateUserValidator=Joi.object({
  password: Joi.string().trim().required(),
  username: Joi.string().trim().required(),
  oldPassword: Joi.string().trim().required(),
})

module.exports = {
  registerValidator,
  loginValidator,
  updateUserValidator
};
