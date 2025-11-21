const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
const ExpressError = require("./utils/ExpressError.js");

const userRouter = require("./routes/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// -------------------- SESSION --------------------
const sessionOptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));   // ✅ only once

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

passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// -------------------- ROUTES --------------------
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "maheshdhondge26@gmail.com",
    username: "delta-student",   // ❗ fixed typo
  });

  let registeredUser = await User.register(fakeUser, "helloWorld");
  res.send(registeredUser);
});

// -------------------- 404 HANDLER --------------------
app.all('*', (req,res,next)=>{
  next(new ExpressError(404,"Page Not Exist"));
});

// -------------------- ERROR HANDLER --------------------
app.use((err, req, res, next) => {
  const {statusCode = 500, message = "Something went wrong"} = err;
  res.status(statusCode).send(message);
});

// -------------------- SERVER --------------------
app.listen(8080, () => {
  console.log("🚀 Server is listening on port 8080"); 
});
