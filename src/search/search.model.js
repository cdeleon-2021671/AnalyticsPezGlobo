"use strict";

const mongoose = require("mongoose");

const searchSchema = mongoose.Schema({
  event: {
    type: String,
    default: "Search",
  },
  sourceUrl: String,
  data: {
    type: {
      type: String,
      default: "Search",
    },
    query: String,
  },
  fingerprint: String,
  time: Date,
});

module.exports = mongoose.model("Search", searchSchema);
