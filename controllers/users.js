module.exports.signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) return next(err);


      req.flash("success", "Welcome to Wanderlust!");
      return res.redirect("/listings");
    });

  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/listings");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};
