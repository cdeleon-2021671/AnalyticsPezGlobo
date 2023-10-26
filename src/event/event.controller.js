"use strict";

const Event = require("./event.model");

const verifyTime = (user, url, key) => {
  if (user.length == 0) return false;
  // limpiar los datos
  const filter = user.filter((item) => {
    const { type } = item.data;
    if (key == type && url == item.sourceUrl) return item;
  });
  if (filter.length == 0) return false;
  // ordenar fecha de la mas reciente a la mas antigua
  filter.sort((a, b) => b.time - a.time);
  // Comparar la ultima fecha con este momento
  const lastTime = filter[0];
  const date = new Date();
  date.setHours(date.getHours() - 6);
  const dateNow = date.toISOString();
  const actual = Date.parse(dateNow);
  const last = Date.parse(lastTime.time);
  const isValid = actual - last;
  if (isValid >= process.env.WAIT_TIME) return false;
  return true;
};

const getEvent = (event, url, type, product, fp) => {
  const { idProduct, name, storeId } = product;
  const sku = `sku-${idProduct}-${name.replace(/[ ]+/g, "-")}`;
  const date = new Date();
  date.setHours(date.getHours() - 6);
  const dateNow = date.toISOString();
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

exports.addEvent = async (req, res) => {
  try {
    const { fingerprint, url, product, event, type } = req.body;
    const user = await Event.find({ fingerprint: fingerprint });
    const flag = verifyTime(user, url, type);
    if (flag) return res.send({ message: "Wait a minute" });
    const myEvent = getEvent(event, url, type, product, fingerprint);
    const newEvent = new Event(myEvent);
    await newEvent.save();
    return res.send({ message: "Event added successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error adding event" });
  }
};

exports.verifyEvent = async (req, res) => {
  try {
    const { fingerprint, url } = req.body;
    const user = await Event.find({
      fingerprint: fingerprint,
      sourceUrl: url,
      event: "Page View",
    });
    // Si no tiene eventos
    if (user.length == 0) return res.send({ message: "false" });
    // Ordenar por fecha
    user.sort((a, b) => b.time - a.time);
    const lastView = user[0].time;
    const date = new Date();
    const newDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    if (JSON.stringify(lastView).includes(newDate))
      return res.send({ message: "true" });
    return res.send({ message: "false" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error verifying click" });
  }
};

exports.getLatestEvents = async (req, res) => {
  try {
    // Traer todas las vistas PAGE VIEW
    const events = await Event.find({ event: "Page View" });
    // Ordenar por fecha de mas reciente a mas antigua
    events.sort((a, b) => {
      return b.time - a.time;
    });
    // Filtrar las vistas de las ultimas 48 horas
    const date = new Date();
    date.setHours(date.getHours() - 6);
    const dateNow = date.toISOString();
    const latestEvents = events.filter((item) => {
      const time = Date.parse(item.time);
      const actual = Date.parse(dateNow);
      const flag = actual - time;
      if (flag < 172800000) return item;
    });
    // Verificar que no se repita la fecha con el usuario y la url visitada
    const trending = [];
    for (const element of latestEvents) {
      let flag = false;
      for (const item of trending) {
        const { sourceUrl, fingerprint, time } = item;
        const url = element.sourceUrl == sourceUrl;
        const user = element.fingerprint == fingerprint;
        const last = new Date(time).toLocaleDateString();
        const actual = new Date(element.time).toLocaleDateString();
        const date = last == actual;
        if (url && user && date) {
          flag = true;
          break;
        }
      }
      if (flag) continue;
      trending.push(element);
    }
    // contar cuantas veces se repiten los productos y ordenarlos segun el conteo
    const result = [];
    for (const element of trending) {
      const { entityId } = element.data;
      const { objectId } = element.data;
      const sku = objectId.split("-")[1];
      // Verificar si el id ya fue contado
      let flag = false;
      for (const item of result) {
        if (item.idProduct != sku) continue;
        flag = true;
        break;
      }
      if (flag) continue;
      // Contar los que se repiten adelante
      let repeat = 0;
      for (const item of trending) {
        if (element.data.objectId == item.data.objectId) repeat++;
      }
      const product = {
        storeId: entityId,
        idProduct: sku,
        views: repeat,
      };
      result.push(product);
    }
    result.sort((a, b)=>{
      return b.views - a.views
    })
    return res.send({ result });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error getting events" });
  }
};
