const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview=async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("⭐ Review Saved");
    res.redirect(`/listings/${listing._id}`);
  }

  module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    console.log("🗑 Review Deleted");
    res.redirect(`/listings/${id}`);
  }