const express = require("express");

require("dotenv").config();

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 8000;

const welcome = (req, res) => {
  res.send("Welcome to my favorite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.get("/api/users", userHandlers.getUser);
app.get("/api/users/:id", userHandlers.getUserById);

const database = require("./database");

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});

const { hashPassword } = require("./auth.js");

app.post("/api/users", hashPassword, userHandlers.postUser);
app.put("/api/users/:id", hashPassword, userHandlers.updateUser);

app.post("/api/movies", movieHandlers.postMovie);
// app.post("/api/users", usersHandler.postUser); replaced by the one above (hashPassword)

app.put("/api/movies/:id", movieHandlers.updateMovie);
// app.put("/api/users/:id", usersHandler.updateUser);

app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.delete("/api/users/:id", userHandlers.deleteUser);
