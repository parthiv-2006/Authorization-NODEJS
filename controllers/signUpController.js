const db = require("../db/pool.js");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs")

exports.signUp_get = (req, res) => {
  res.render("sign_up", {
    title: "Sign Up",
    errors: [],
  });
};

exports.signUp_post = [
  body("first_name", "First name must not be empty").trim().escape(),
  body("last_name", "Last name must not be empty").trim().escape(),
  body("username", "Username must not be empty")
    .trim()
    .isLength({ max: 50 })
    .escape(),
  body("password", "Password must be at least 8 characters long").isLength({
    min: 8,
  }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("sign_up", {
        title: "Sign Up",
        errors: errors.array(),
      });
      return;
    }

    try {
      const userExists = await db.query(
        "SELECT * FROM users WHERE username = $1",
        [req.body.username]
      );

      if (userExists.rows.length > 0) {
        res.render("sign_up", {
          title: "Sign Up",
          errors: ["An account with this username already exists"],
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const query =
        "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)";
      const values = [
        req.body.first_name,
        req.body.last_name,
        req.body.username,
        hashedPassword,
      ];
      await db.query(query, values);
      res.redirect("/");
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
];

module.exports = exports;
