const database = require("./database");

const getUser = (req, res) => {
  let sql = "SELECT * from users";
  const sqlValue = [];

  if (req.query.language != null) {
    sql += " where language=?";
    sqlValue.push(req.query.language);

    if (req.query.city != null) {
      sql += " and city=?";
      sqlValue.push(req.query.city);
    }
  } else if (req.query.city != null) {
    sql += " where city=?";
    sqlValue.push(req.query.city);
  }

  database
    .query(sql, sqlValue)
    .then(([users]) => {
      if (users[0] != null) {
        res.json(users);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("SELECT *, null AS hashedPassword from users where id = ?", [id])
    .then(([users]) => {
      if (users[0] != null) {
        res.json(users[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const postUser = (req, res) => {
  const { firstname, lastname, email, city, language, hashedPassword } =
    req.body;

  database
    .query(
      "INSERT INTO users(firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language, hashedPassword]
    )
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the user");
    });
};

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { firstname, lastname, email, city, language, hashedPassword } =
    req.body;
  database
    .query(
      "update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ?, hashedPassword = ? where id = ?",
      [firstname, lastname, email, city, language, hashedPassword, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        console.log("result " + result.changedRows);
        res.status(204).send("result");
      }
    })
    .catch((err) => {
      res.status(500).send("Error editing the user" + err);
    });
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("delete from users where id=?", [id])
    .then(([results]) => {
      if (results.affectedRows > 0) {
        res.status(200).send("User deleted");
      } else {
        res.status(404).send("User not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting user");
    });
};

module.exports = {
  getUser,
  getUserById,
  postUser,
  updateUser,
  deleteUser,
};
