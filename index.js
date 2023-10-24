"use strict";

const app = require("./config/app");
app.initServer();
const mongo = require("./config/mongo");
mongo.connect();
