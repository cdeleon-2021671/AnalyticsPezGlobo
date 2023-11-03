// Utilizar modo estricto de javascript
"use strict";

// Importar express
const express = require("express");
// Utilizar el enrutador de express
const api = express.Router();
// Importar el controlador para utilizar las funciones
const searchController = require("./search.controller");

// Api de tipo post con una funcion del controlador correspondiente
api.post("/add-event", searchController.addEvent);

// Exportar todas las rutas que hayan sido declaradas
module.exports = api;
