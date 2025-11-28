const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
   
  },
  description: String,
 image: {
    image: String,
      url: String,
      filename: String
  },
  price: Number,
  location: String,
  country: String,

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner:{
    type: Schema.Types.ObjectId,
    ref: "User",
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
