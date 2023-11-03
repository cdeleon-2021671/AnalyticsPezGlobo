// Utilizar el modo estricto de javascript
"use strict";

// Importar mongoose para crear modelo en la base de datos
const mongoose = require("mongoose");

// Crear esquema con los datos correspondientes
const searchSchema = mongoose.Schema({
  // Atributo event que debe ser cadena de texto y por defecto sera "Search"
  event: {
    type: String,
    default: "Search",
  },
  // Atributo sourceUrl que debe ser cadena de texto
  sourceUrl: String,
  // Atributo data de tipo objeto
  data: {
    // key de data que debe ser cadena de texto y por defecto sera "Search"
    type: {
      type: String,
      default: "Search",
    },
    // key de data que debe ser cadena de texto
    query: String,
  },
  // Atributo fingerprint que debe ser cadena de texto
  fingerprint: String,
  // Atributo time que sera de tipo date y contendra fecha y hora estandar de tipo ISO
  time: Date,
});

// Exportar esquema como modelo para que se cree en la base de datos y se pueda utilizar aqui
module.exports = mongoose.model("Search", searchSchema);
