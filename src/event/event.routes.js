"use strict";

const express = require("express");
const api = express.Router();
const eventController = require("./event.controller");

api.post("/add-event", eventController.addEvent);
api.post("/verify-event-day", eventController.verifyEvent);
api.get("/get-latest-events", eventController.getLatestEvents);

module.exports = api;
