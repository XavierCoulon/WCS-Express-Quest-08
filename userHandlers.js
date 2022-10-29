const database = require("./database");

const getUsers = (req, res) => {
  database
    .query("select * from users")
    .then(([users]) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from db.");
    });
};

const getOneUser = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from users where id = ?", [id])
    .then(([users]) => {
      if (users.length > 0) {
        res.status(200).json(users[0]);
      } else {
        res.status(404).send("User not found...");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from db.");
    });
};

module.exports = {
  getUsers,
  getOneUser,
};
