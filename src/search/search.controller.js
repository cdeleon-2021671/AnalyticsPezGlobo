// Utilizar el modo estricto de javascript
"use strict";

// Importar el modelo a utilizar
const Search = require("./search.model");

// Exportar funcion que añade el evento cuando el usuario hace alguna busqueda
exports.addEvent = async (req, res) => {
  // Bloque try catch por cualquier error
  try {
    // Extraer los parametros que vienen del body (parametros que se envian en la peticion)
    const { fingerprint, url, query } = req.body;
    // Instancia de tipo fecha
    const date = new Date();
    // Se actualizar la hora con 6 horas menos para estar en nuestra hora actual
    date.setHours(date.getHours() - 6);
    // Convierte la fecha a formatio ISO
    const dateNow = date.toISOString();
    // Declarar objeto con los datos del modelo
    const event = {
      sourceUrl: url,
      data: {
        type: "Search",
        query: query,
      },
      fingerprint: fingerprint,
      time: dateNow,
    };
    // Instancia del modelo Search
    const newSearch = new Search(event);
    // Guardar los datos en la base de datos
    await newSearch.save();
    // Retornar mensaje de satisfaccion (mensaje que no se muestra)
    return res.send({ message: "Event added successfully" });
  } catch (err) {
    // Mostrar el consola el error
    console.log(err);
    // Returnar al usuario un mensaje de error (mensaje que no se muestra)
    return res.status(500).send({ message: "Error adding event" });
  }
};
