require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

const { validateMovie } = require("./validators.js");
const {
  hashPassword,
  verifyPassword,
  verifyToken,
  verifyUserId,
} = require("./auth.js");

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");
const { validateJoiMovie } = require("./validatorsJoij.js");
const { validateJoiUser } = require("./validatorsJoij.js");

// Public Routes

app.get("/", welcome);
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getOneUser);
app.post("/api/users", validateJoiUser, hashPassword, userHandlers.postUser);

// Public - Login
app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

// Authentification wall

app.use(verifyToken);

// Protected Routes

app.post("/api/movies", validateJoiMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", movieHandlers.putMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

//Check id user to enable (verifyUserId)

app.put(
  "/api/users/:id",
  validateJoiUser,
  verifyUserId,
  hashPassword,
  userHandlers.putUser
);
app.delete("/api/users/:id", verifyUserId, userHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
