module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

// Optional: middleware to require login for certain routes
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl; // save url
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  next();
};
