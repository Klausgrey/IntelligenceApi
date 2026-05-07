const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  count: { type: Number, required: true },
  countryId: { type: String, required: true },
  probability: { type: Number, required: true },
  createsAt: {type: Date, default: Date.now()}
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
