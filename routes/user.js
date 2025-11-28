const express = require("express");
const router = express.Router();
const passport = require("passport");
const flash = require("connect-flash");
const wrapAsync = require("../utils/wrapAsync.js");

const userController = require("../controllers/users.js");

// Apply flash middleware BEFORE routes
router.use(flash());

// ---------------- SIGNUP ---------------- //
router
  .route("/signup")
  .get((req, res) => {
    res.render("users/signup.ejs");
  })
  .post(wrapAsync(userController.signUp));

// ---------------- LOGIN ---------------- //
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    (req, res) => {
      req.flash("success", "Welcome back to Wanderlust!");
      res.redirect("/listings");
    }
  );

// ---------------- LOGOUT ---------------- //
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);   // FIXED ERROR HANDLER
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
});

module.exports = router;
