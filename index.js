"use strict";

// Importar funcion que inicia el servidor
const app = require("./config/app");
// Utilizar funcion que inicia el servidor
app.initServer();
// Importar funcion que conecta a la base de datos
const mongo = require("./config/mongo");
// Utilizar funcion que conecta a la base de datos
mongo.connect();
