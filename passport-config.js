// passport-config.js

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("./db/pool"); // Make sure this path is correct

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Find the user by their email (which we use as the username)
      const result = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);
      const user = result.rows[0];

      if (!user) {
        // User not found
        return done(null, false, { message: "Incorrect username" });
      }

      // User found, now compare passwords
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // Passwords do not match
        return done(null, false, { message: "Incorrect password" });
      }

      // Credentials are correct
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});
