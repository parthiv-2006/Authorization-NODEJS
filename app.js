const express = require("express")
require("dotenv").config()
const app = express()
const PORT = 3000
const path = require("path")
const session = require("express-session")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy

const signUpRouter = require("./routes/signUpRoute")


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.render("index"));
app.use("/sign-up", signUpRouter)

app.listen(PORT, (err)=> {
    if (err) {
        console.log(err)
    }
    console.log(`Server Running on Port ${PORT}`)
})