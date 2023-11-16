// Utilizar el modo estricto de javascript
"use strict";

// Importar el modelo a utilizar
const Event = require("./event.model");

// Funcion para verificar que no ha pasado mas de un minuto
const verifyTime = (user, url, key) => {
  // verifica que si no viene una lista de usuairos y retorna false para acabar la funcion
  if (user.length == 0) return false;
  // recorer el aregglo
  const filter = user.filter((item) => {
    // extrae que tipo de evento es
    const { type } = item.data;
    // si es la misma url, el mismo usuario y el mismo tipo de evento entonces return el item
    if (key == type && url == item.sourceUrl) return item;
  });
  // Valida si no hay elementos del filter anterior entonces terminar la funcion
  if (filter.length == 0) return false;
  // Ordenar los resultado del mas reciente al mas antiguo
  filter.sort((a, b) => b.time - a.time);
  // Utilizar el primer elemento ya que es el evento mas reciente
  const lastTime = filter[0];
  // Instancia de tipo date
  const date = new Date();
  // Actualizar la hora con 6 horas menos para obtener la hora actual
  date.setHours(date.getHours() - 6);
  // Convertir la hora actual en formato ISO
  const dateNow = date.toISOString();
  // Convertir la hora actual en formato UNIX
  const actual = Date.parse(dateNow);
  // Convertir la hora del evento mas reciente en formato UNIX
  const last = Date.parse(lastTime.time);
  // Restar la hora actual con la hora del evento mas reciente
  const isValid = actual - last;
  // Si el resultado es mayor o igual a un minuto entonces terminar la funcion
  if (isValid >= process.env.WAIT_TIME) return false;
  // Si no es mayor entonces acabar la funcion con true para indicar que no puede realizarse el evento
  return true;
};

// Funcion que crea el objeto con los datos del evento
const getEvent = (event, url, type, product, fp) => {
  // extrae los datos que viene del producto
  const { idProduct, name, storeId } = product;
  // se crea la llave sku (key unico del producto)
  const sku = `sku-${idProduct}-${name.replace(/[ ]+/g, "-")}`;
  // instancia de tipo date
  const date = new Date();
  // se actualizar la hora con 6 horas menos para obtener la hora actual
  date.setHours(date.getHours() - 6);
  // convierte la hora en formato ISO
  const dateNow = date.toISOString();
  // retorna un objeto con los datos como aparece en el modelo
  return {
    event: event,
    sourceUrl: url,
    data: {
      type: type,
      entity: storeId.name,
      entityId: storeId._id,
      object: name,
      objectId: sku,
    },
    fingerprint: fp,
    time: dateNow,
  };
};

// Funcion que agrega los eventos (funcion que sirve de api)
exports.addEvent = async (req, res) => {
  // Bloque try catch para cualquier error
  try {
    // Extraer los parametros que vienen del body (parametros que se envian en la peticion)
    const { fingerprint, url, product, event, type } = req.body;
    // Buscar en la base de datos el usuario que realizo el evento
    const user = await Event.find({ fingerprint: fingerprint });
    // Utilizar funciona de validar la hora, el usuario, la ruta y el evento realizado
    const flag = verifyTime(user, url, type);
    // Si la funcion retorna verdadero entonces tiene que esperar un minuto para realizar el evento
    if (flag) return res.send({ message: "Wait a minute" });
    // De lo contrario se creara el objeto con los datos del evento
    const myEvent = getEvent(event, url, type, product, fingerprint);
    // Instancia del modelo Event
    const newEvent = new Event(myEvent);
    // Guardar en la base de datos
    await newEvent.save();
    // Retornar un mensaje de evento agregado (mensaje que no se muestra)
    return res.send({ message: "Event added successfully" });
  } catch (err) {
    // Mensaje en consola por algun error
    console.log(err);
    // Mensaje al usuario ante algun error (mensaje que no se muestra)
    return res.status(500).send({ message: "Error adding event" });
  }
};

// Funcion que valida si el usuario ya realizo un evento a esa ruta hoy (funcion que sirve de api)
exports.verifyEvent = async (req, res) => {
  // Bloque try catch para cualquier error
  try {
    // Extraer los parametros que vienen del body (parametros que se envian en la peticion)
    const { fingerprint, url } = req.body;
    // Buscar en la base de datos si hay un evento de Vista de producto con el mismo usuario y ruta
    const user = await Event.find({
      fingerprint: fingerprint,
      sourceUrl: url,
      event: "Page View",
    });
    // Si no existe entonces returnar false al usuario
    if (user.length == 0) return res.send({ message: "false" });
    // Ordenar por fecha del mas reciente al mas antiguo todos los resultado
    user.sort((a, b) => b.time - a.time);
    // Utilizar el primer elemento ya que es el evento mas reciente
    const lastView = user[0].time;
    // Instancia de tipo date
    const date = new Date();
    // Obtener unicamente el dia, mes y año de hoy de la instancia date
    const newDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    // convertir en string la fecha reciente, validar si es igual que la de hoy (newDate) y returnar true
    if (JSON.stringify(lastView).includes(newDate))
      return res.send({ message: "true" });
    // si no es igual entonces returnar false
    return res.send({ message: "false" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error verifying click" });
  }
};

// Obtener los eventos mas recientes a mas antiguos (funcion que sirve de api)
exports.getLatestEvents = async (req, res) => {
  try {
    // Traer todos los eventos de PAGE VIEW
    const events = await Event.find({ event: "Page View" });
    // Ordenar por fecha de mas reciente a mas antigua
    events.sort((a, b) => {
      return b.time - a.time;
    });
    // Instancia de tipo date
    const date = new Date();
    // Actualizar la hora con 6 horas menos para obtener la hora actual
    date.setHours(date.getHours() - 6);
    // Convertir la hora actual en formato ISO
    const dateNow = date.toISOString();
    // validar si cada evento ha sido en 48 horas
    const latestEvents = events.filter((item) => {
      // Convertir la hora del evento en formato UNIX
      const time = Date.parse(item.time);
      // Convertir la hora actual en formato UNIX
      const actual = Date.parse(dateNow);
      // Restar la hora actual y la hora del evento
      const flag = actual - time;
      // Validar si es menor a 48 horas
      if (flag < 172800000) return item;
    });
    // Arreglo para almacenar eventos sin repetir el dia, usuario y ruta
    const trending = [];
    // Recorrer el arreglo latestEvents
    for (const element of latestEvents) {
      let flag = false;
      // Recorrer el arreglo trending
      for (const item of trending) {
        // extraer los datos de item ya que item es cada elemento de trending
        const { sourceUrl, fingerprint, time } = item;
        // item es cada elemento de trending y element es cada elemento de latestEvents
        // validar si la ruta de element es igual a la ruta de item
        const url = element.sourceUrl == sourceUrl;
        // validar si el usuario de element es igual a la ruta de item
        const user = element.fingerprint == fingerprint;
        // convertir fecha de item en formato local (ej: 01/11/2023)
        const last = new Date(time).toLocaleDateString();
        // convertir fecha de element en formato local (ej: 01/11/2023)
        const actual = new Date(element.time).toLocaleDateString();
        // validar si la fecha element es igual a la ruta de item
        const date = last == actual;
        // Si todo coincide entonces cambiar flag a true y terminar el break
        if (url && user && date) {
          flag = true;
          break;
        }
      }
      // Si flag es verdadero entonces encontro dos eventos que son el mismo dia, el mismo usuario y la misma ruta
      // Continua el bucle saltandose lo que esta despues
      if (flag) continue;
      // En caso que sea false agrega al arreglo trending el evento actual
      trending.push(element);
    }
    // Arreglo que servira para almacenar productos sin repetir
    const result = [];
    // Recorrer el arreglo que contiene los eventos sin repetir el dia, usuario y fecha
    for (const element of trending) {
      // extraer los datos de element ya que element es cada elemento de trending
      const { entityId } = element.data;
      const { objectId } = element.data;
      // Divide el sku en donde hay "-" y agarra el que esta en la posicion 1 (ej: sku-121-molvu, res: [sku, 121])
      const sku = objectId.split("-")[1];
      let flag = false;
      // Recorrer el arreglo que tiene los productos
      for (const item of result) {
        // si el sku y el idProduct de item son diferentes entonces continua y salta al siguente elemento
        if (item.idProduct != sku) continue;
        // si es la misma tienda continua
        if(item.storeId != entityId) continue;
        // cambia flag a true y termina el bucle
        flag = true;
        break;
      }
      // Si flag es verdadero entonces encontro que son diferentes continua y salta al siguiente elemento
      if (flag) continue;
      // Contar los que se repiten adelante
      let repeat = 0;
      // Recorres el arreglo de trending
      for (const item of trending) {
        // si los object id son iguales aumente repeat en 1
        if (element.data.objectId == item.data.objectId) repeat++;
      }
      // crea el producto con el id de la tienda, id del producto (sku) y las vistas que ha tenido
      const product = {
        storeId: entityId,
        idProduct: sku,
        views: repeat,
      };
      // agrega el producto a result
      result.push(product);
    }
    // Ordena los productos con el que tenga mas vistas al que tiene menos vistas
    result.sort((a, b) => {
      return b.views - a.views;
    });
    // Returna el arreglo de productos al usuario
    return res.send({ result });
  } catch (err) {
    // Muestra mensaje de error en la consola
    console.log(err);
    // Returna mensaje de error al usuario (el usuario no love)
    return res.status(500).send({ message: "Error getting events" });
  }
};
