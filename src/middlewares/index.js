const { registerValidator, loginValidator,updateUserValidator } = require("./validationSchema");

const validateRegisterBody = (req, res, next) => {
  const { error, value } = registerValidator.validate(req.body,{abortEarly:false});
  if (error) return res.status(422).json({ message: error.message });
  req.body=value;
  next();
};

const validateLoginBody = (req, res, next) => {
  const { error, value } = loginValidator.validate(req.body,{abortEarly:false});
  if (error) return res.status(422).json({ message: error.message });
  req.body=value;
  next();
};

const validateUpdateUserBody = (req, res, next) => {
  const { error, value } = updateUserValidator.validate(req.body,{abortEarly:false});
  if (error) return res.status(422).json({ message: error.message });
  req.body=value;
  next();
};

module.exports = {
  validateRegisterBody,
  validateLoginBody,
  validateUpdateUserBody
};
