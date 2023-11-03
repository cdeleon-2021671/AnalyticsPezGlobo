"use strict";

// Importar express para el servidor
const express = require("express");
// Utilizar la funcion de express
const app = express();
// Importar cors para seguridad
const cors = require("cors");
// Importar morgan para ayudar al desarrolador
const morgan = require("morgan");
// Importar helmet para la seguridad http
const helmet = require("helmet");
// Imprtar dotenv e indicar que utilizara las variables de produccion
require("dotenv").config({ path: ".env.prod" });
// Asignar un puerto de las variables de entorno y si en caso no lo encuentra utilizar el 3500
let port = process.env.PORT || 3500;
// Importar rutas a utilizar
const eventRoutes = require("../src/event/event.routes");
const searchRoutes = require("../src/search/search.routes");

// Parsear datos a peticiones http
app.use(express.urlencoded({ extended: false }));
// Convertir peticiones en objetos json
app.use(express.json());

// Utilizar cors en el servidor con la configuracion para tienda.gt
app.use(
  cors({
    origin: ["https://tienda.gt", "https://www.tienda.gt"],
    exposeHeaders: ['Referer'],
    credentials: true
  })
);
// Utilizar helmet en el servidor
app.use(helmet());
// Utilizar morgan como desarrolador en el servidor
app.use(morgan("dev"));

// Establecer las rutas raices y subrutas a utilizar
app.use("/event", eventRoutes);
app.use("/search", searchRoutes);

// Funcion para iniciar el servidor en puerto designado
exports.initServer = async () => {
  // Iniciar servidor en el puerto
  app.listen(port);
  // Mostrar mensaje de funcionamiento
  console.log(`Http server running on port ${port}`);
};
