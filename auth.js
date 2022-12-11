const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (req, res, next) => {
  argon2
    .hash(req.body.password, hashingOptions)
    .then((hashedPassword) => {
      req.body.hashedPassword = hashedPassword;
      delete req.body.password;

      next();
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const verifyPassword = async (req, res) => {
  try {
    if (await argon2.verify(req.user.hashedPassword, req.body.password)) {
      const payload = { sub: req.user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token, user_email: req.user.email });
    } else res.sendStatus(401);
  } catch (err) {
    res.sendStatus(500);
  }
};

const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");

    if (authorizationHeader == null) {
      throw new Error("Authorization header is missing");
    }

    const [type, token] = authorizationHeader.split(" ");

    if (type !== "Bearer") {
      throw new Error("Authorization header has not the 'Bearer' type");
    }

    req.payload = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
};

//Check for method put and delete on users

const verifyUserId = (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");
    const token = authorizationHeader.split(" ")[1];
    const id = parseInt(req.params.id);

    if (id !== jwt.decode(token).sub) {
      throw new Error("User not authorized for this action...");
    }

    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(403);
  }
};

module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
  verifyUserId,
};
