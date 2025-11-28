const express = require("express");
const router = express.Router({ mergeParams: true }); // ⭐ MUST HAVE
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js"); // ⭐ FIXED PATH
const Listing = require("../models/listing.js");

const reviewController = require("../controllers/reviews.js");

// Validation middleware
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Create Review (POST)
router.post(
  "/",
  validateReview,
  wrapAsync(reviewController.createReview)
);

// Delete Review (DELETE)
router.delete(
  "/:reviewId",
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
