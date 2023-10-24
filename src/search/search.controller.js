"use strict";

const Search = require("./search.model");

exports.addEvent = async (req, res) => {
  try {
    const { fingerprint, url, query } = req.body;
    const date = new Date();
    date.setHours(date.getHours() - 6);
    const dateNow = date.toISOString();
    const event = {
      sourceUrl: url,
      data: {
        type: "Search",
        query: query,
      },
      fingerprint: fingerprint,
      time: dateNow,
    };
    const newSearch = new Search(event);
    await newSearch.save();
    return res.send({ message: "Event added successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error adding event" });
  }
};
