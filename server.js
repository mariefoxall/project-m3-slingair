"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { flights } = require("./test-data/flightSeating");
const { v4: uuidv4 } = require("uuid");
const users = [];

express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))

  // endpoints
  .get("/flightdata", (req, res) =>
    res.status(200).json({
      flights: flights,
    })
  )

  .get("/flightNumbers", (req, res) =>
    res.status(200).json(Object.keys(flights))
  )

  .get("/flights/:num", (req, res) => {
    console.log("****************");
    const flightNumber = req.params.num;
    console.log(flightNumber);
    res.status(200).json({
      flight: flights[flightNumber],
    });
  })

  .post("/users", (req, res) => {
    //validate user = one time only
    const newUser = req.body;
    if (users.find((user) => user.email === newUser.email)) {
      res.status(404).json({ message: "user already registered" });
    } else {
      newUser.id = uuidv4();
      users.push(newUser);
      res.status(201).json({ id: newUser.id });
    }
  })

  // .post("/reservation", (req, res) => {
  //   const reservationID = req.body.id;
  // })

  .get("/users/:id", (req, res) => {
    const id = req.params.id;
    const thisUser = users.find((user) => user.id === id);
    thisUser
      ? res.status(200).json({ user: thisUser })
      : res.status(404).json({ message: "not a user" });
  })

  .use((req, res) => res.send("Not Found"))
  .listen(8000, () => console.log(`Listening on port 8000`));
