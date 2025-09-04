const express = require("express")
require("dotenv").config()
const app = express()
const PORT = 3000
const path = require("path")
const session = require("express-session")
const passport = require("passport")

const signUpRouter = require("./routes/signUpRoute")
require("./passport-config")


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Makes user available in all views
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.render("index"));
app.use("/sign-up", signUpRouter)

app.listen(PORT, (err)=> {
    if (err) {
        console.log(err)
    }
    console.log(`Server Running on Port ${PORT}`)
})