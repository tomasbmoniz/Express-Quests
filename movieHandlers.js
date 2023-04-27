const database = require("./database");

const getMovies = (req, res) => {
  let sql = "select * from movies";
  const sqlValue = [];
  if (req.query.color != null && req.query.max_duration != null) {
    sql += " where color=? and duration<=?";
    sqlValue.push(req.query.color);
    sqlValue.push(req.query.max_duration);
  } else if (req.query.color != null) {
    sql += " where color=?";
    sqlValue.push(req.query.color);
  } else {
    sql += " where duration<=?";
    sqlValue.push(req.query.max_duration);
  }

  database
    .query(sql, sqlValue)
    .then(([movies]) => {
      if (movies[0] != null) {
        res.json(movies);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from movies where id = ?", [id])
    .then(([movies]) => {
      if (movies[0] != null) {
        res.json(movies[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;
  database
    .query(
      // "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      // [title, director, year, color, duration]
      "INSERT INTO movies SET ?",
      req.body
    )
    .then(([result]) => {
      // console.log(result)
      // wait for it
      res.location(`/api/movies/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movie");
    });
};

const updateMovie = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, director, year, color, duration } = req.body;

  database
    // .query("update movies set ? where id =?", req.body)
    .query(
      "update movies set title = ?, director = ?, year = ?, color = ?, duration = ? where id = ?",
      [title, director, year, color, duration, id]
    )
    .then(([results]) => {
      // console.log(results)
      if (results.affectedRows > 0) {
        res.status(204).send("Movie updated successfully");
      } else {
        res.status(404).send("Movie not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error updating the movie");
    });
};

const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("delete from movies where id=?", [id])
    .then(([results]) => {
      if (results.affectedRows > 0) {
        res.status(200).send("Movie Deleted");
      } else {
        res.status(404).send("Movie not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting the movie");
    });
};

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  updateMovie,
  deleteMovie,
};
