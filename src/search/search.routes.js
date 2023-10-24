"use strict";

const express = require("express");
const api = express.Router();
const searchController = require("./search.controller");

api.post("/add-event", searchController.addEvent);

module.exports = api;
