// Utilizar el modo estricto de javascript
"use strict";

// Importar mongoose para conectar a la base de datos
const mongoose = require("mongoose");
// Importar y utilizar dotenv para variables de produccion
require("dotenv").config({ path: ".env.prod" });

// Funcion que conecta a la base de datos
exports.connect = async () => {
  try {
    // Utilizar la ruta para conectarse a la base de datos
    const uriMongo = `${process.env.URI_MONGO}`;
    // Quitar el modo estricto ante cualquier consulta
    mongoose.set("strictQuery", false);
    // Conectar a la base de datos
    await mongoose.connect(uriMongo);
    // Mensaje de conectado
    console.log(`Connected to db`);
  } catch (err) {
    // Mostrar el error en consola
    console.log(err);
  }
};
