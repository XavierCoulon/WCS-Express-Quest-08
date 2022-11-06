const Joi = require("joi");

const userSchema = Joi.object({
  firstname: Joi.string().max(255).required(),
  lastname: Joi.string().max(255).required(),
  email: Joi.string().email().max(255).required(),
  city: Joi.string().max(255).required(),
  language: Joi.string().max(255).required(),
});

const validateJoiUser = (req, res, next) => {
  const { firstname, lastname, email, city, language } = req.body;

  const { error } = userSchema.validate(
    { firstname, lastname, email, city, language },
    { abortEarly: false }
  );

  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {
    next();
  }
};

const movieSchema = Joi.object({
  title: Joi.string().max(255).required(),
  director: Joi.string().max(255).required(),
  year: Joi.number().integer().max(2023).required(),
  color: Joi.boolean().required(),
  duration: Joi.number().integer().required(),
});

const validateJoiMovie = (req, res, next) => {
  const { title, director, year, color, duration } = req.body;
  const { error } = movieSchema.validate(
    { title, director, year, color, duration },
    { abortEarly: false }
  );

  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {
    next();
  }
};

module.exports = {
  validateJoiMovie,
  validateJoiUser,
};
