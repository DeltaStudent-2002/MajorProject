
if(process.env.NODE_ENV != "production"){
  require('dotenv').config();  
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const userRouter = require("./routes/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js")


const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret: "mysupersecretcode",
  },
  touchAfter: 24*3600,
});

// -------------------- SESSION --------------------
const sessionOptions = {
  store,
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};




app.use(session(sessionOptions));  
app.use(flash());

// -------------------- VIEW ENGINE --------------------
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// -------------------- MIDDLEWARE --------------------
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// -------------------- PASSPORT SETUP --------------------
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// -------------------- ROUTES --------------------

app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser=req.user;
  next();
})
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "maheshdhondge26@gmail.com",
    username: "delta-student",   
  });

  let registeredUser = await User.register(fakeUser, "helloWorld");
  res.send(registeredUser);
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all('*', (req,res,next)=>{
  next(new ExpressError(404,"Page Not Exist"));
});

// -------------------- ERROR HANDLER --------------------
app.use((err, req, res, next) => {
  const {statusCode = 500, message = "Something went wrong"} = err;
  res.status(statusCode).send(message);
});

// -------------------- SERVER --------------------
app.listen(8040, () => {
  console.log("🚀 Server is listening on port 8040"); 
});