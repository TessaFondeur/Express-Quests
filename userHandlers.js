const database = require("./database");

const getUsers = (req, res) => {
    const sql = 'select firstname, lastname, city, language from users';
    const sqlValues = [];

    if (req.query.language != null) {
        sql += " where language = ?";
        sqlValues.push(req.query.language);
        if (req.query.city != null) {
            sql += " and city = ?";
            sqlValues.push(req.query.city);
        }
    } else if (req.query.city != null) {
        sql += " where city = ?";
        sqlValues.push(req.query.city);
    }


    database
        .query(sql, sqlValues)
        .then(([users]) => {
            res.json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving data from database");
        });
};

const getUserById = (req, res) => {
    const id = parseInt(req.params.id);

    database
        .query("select firstname, lastname, city, language from users where id = ?", [id])
        .then(([users]) => {
            if (users[0] != null) {
                res.json(users[0]);
            } else {
                res.status(404).send('Not Found');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving data from database");
        });
};

const postUsers = (req, res) => {
    const { firstname, lastname, email, city, language, hashedPassword } = req.body;

    database
        .query('INSERT INTO users(firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)',
            [firstname, lastname, email, city, language, hashedPassword])
        .then(([result]) => {
            res.location(`/api/users/${result.insertId}`).sendStatus(201);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error saving the user");
        });
};

const updateUsers = (req, res) => {
    const id = parseInt(req.params.id);
    const { firstname, lastname, email, city, language, hashedPassword } = req.body;

    database
        .query('UPDATE users set firstname = ?, lastname = ?, email = ?, city = ?, language = ?, hashedPassword = ? where id = ?',
            [firstname, lastname, email, city, language, hashedPassword, id])
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.status(404).send('Not found');
            } else {
                res.sendStatus(204);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error editing the user");
        });
};

const deleteUsers = (req, res) => {
    const id = parseInt(req.params.id);

    database
        .query('DELETE FROM users WHERE id = ?',
            [id])
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.status(404).send('Not found');
            } else {
                res.sendStatus(204);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error deleting the user");
        });
};

module.exports = {
    getUsers,
    getUserById,
    postUsers,
    updateUsers,
    deleteUsers
};