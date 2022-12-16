const { model, Schema } = require("mongoose");

module.exports = model(
  "Points",
  new Schema({
    Guild: String,
    User: String,
    Points: Number,
  })
);
