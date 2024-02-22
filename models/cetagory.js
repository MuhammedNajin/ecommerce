const mongoose = require("mongoose");

const cetagory = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isListed: {
    type: Boolean,
  },
});

module.exports = mongoose.model("cetagory", cetagory);
