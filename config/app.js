"use strict";

const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
require("dotenv").config({ path: ".env.prod" });
let port = process.env.PORT || 3000;

// Traer las rutas a utilizar
const eventRoutes = require("../src/event/event.routes");
const searchRoutes = require("../src/search/search.routes");

// Convertir las peticiones en objetos json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// validar que solo tienda.gt pueda acceder
const allowedOrigins = ['https://tienda.gt', 'https://www.tienda.gt'];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Dominio no permitido por CORS'));
    }
  },
};

// Utilizar las dependencias
app.use(cors(corsOptions)); // Para poder utilizar otros puertos externos (front)
app.use(helmet()); // Para proteger el proyecto de vulnerabilidades
app.use(morgan("dev")); // Herramienta de desarrollo

// Establecer las rutas raices y las rutas a utilizar
app.use("/event", eventRoutes);
app.use("/search", searchRoutes);

// Funcion para iniciar el servidor en un puerto designado
exports.initServer = async () => {
  app.listen(port);
  console.log(`Http server running on port ${port}`);
};
