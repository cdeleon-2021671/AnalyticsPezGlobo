// Utilizar le modo estricto de javascript
"use strict";

// Importar express
const express = require("express");
// Utilizar el enrutador de express
const api = express.Router();
// Importar el controlador para las funciones a utilizar
const eventController = require("./event.controller");

// Api de tipo post con su funcion del controlador correspondiente
api.post("/add-event", eventController.addEvent);
api.post("/verify-event-day", eventController.verifyEvent);
// api de tipo get con su funcion correspondiente
api.get("/get-latest-events", eventController.getLatestEvents);

// Exportar todas las rutas que hayan sido declaradas
module.exports = api;
