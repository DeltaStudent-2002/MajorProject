module.exports.isLoggedIn=(req,res, next)=>{
    console.log(req.path,"..", req.originalUrl);
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
     req.flash("error", "you must be loggd in create listings");
     return res.redirect("/login");
  }
  next();
}

module.exports.savedRedirectUrl = (req, res, next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = (req,res,next)=>{
  let { id } = req.params;
  if(!listing.owner.equals(currUser._id)){
    req.flash("error", "you don't have permission to edit");
    res.redirect(`/listings/${id}`);
  }
  next();
}