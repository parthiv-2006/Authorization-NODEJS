const express = require("express")
const router = express.Router()
const passport = require("passport")

const signUpController = require("../controllers/signUpController")

router.get('/', signUpController.signUp_get)

router.post('/', signUpController.signUp_post)

router.get('/log-in', signUpController.log_in_get)

router.post("/log-in", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in"
}))

router.get("/log-out", (req, res, next)=> {
    req.logout((err)=> {
        if (err) {
            return next(err)
        }
        res.redirect("/")
    })
})

module.exports = router;