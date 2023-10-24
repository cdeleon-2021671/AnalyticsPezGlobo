"use strict";

const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  event: {
    type: String,
    enums: ["Page View", "Contact"],
  },
  sourceUrl: String,
  data: {
    type: {
      type: String
    },
    entity: String,
    entityId: String,
    object: String,
    objectId: String,
  },
  fingerprint: String,
  time: Date,
});

module.exports = mongoose.model("Event", eventSchema);
