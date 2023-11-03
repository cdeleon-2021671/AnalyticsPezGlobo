// Utilizar el modo estricto de javascript
"use strict";

// Importar mongoose para crear modelo en la base de datos
const mongoose = require("mongoose");

// Crear esquema con los datos correspondientes
const eventSchema = mongoose.Schema({
  // Atributo event que debe ser cadena de texto
  event: {
    type: String,
    // Solo aceptara cuando el texto sea "Page View" o "Contact"
    enums: ["Page View", "Contact"],
  },
  // Atributo sourceUrl que debe ser cadena de texto
  sourceUrl: String,
  // Atributo data de tipo objeto
  data: {
    // key de data que debe ser cadena de texto
    type: {
      type: String,
    },
    // key de data que debe ser cadena de texto
    entity: String,
    // key de data que debe ser cadena de texto
    entityId: String,
    // key de data que debe ser cadena de texto
    object: String,
    // key de data que debe ser cadena de texto
    objectId: String,
  },
  // Atributo fingerprint que debe ser cadena de texto
  fingerprint: String,
  // Atributo time que sera de tipo date y contendra fecha y hora estandar de tipo ISO
  time: Date,
});

// Exportar esquema como modelo para que se cree en la base de datos y se pueda utilizar aqui
module.exports = mongoose.model("Event", eventSchema);
