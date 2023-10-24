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
