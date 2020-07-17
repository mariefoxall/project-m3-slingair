"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const request = require("request-promise");

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

  .get("/flightNumbers", async (req, res) => {
    const flightNumbersObject = await request(
      "https://journeyedu.herokuapp.com/slingair/flights"
    );
    const flightNumbers = JSON.parse(flightNumbersObject).flights;
    res.status(200).json(flightNumbers);
    // res.status(200).json(Object.keys(flights))
  })

  .get("/flights/:flight", async (req, res) => {
    // console.log("****************");
    const flightNumber = await req.params.flight;
    const flightDetails = await request(
      `https://journeyedu.herokuapp.com/slingair/flights/${flightNumber}`
    );
    // console.log(flightDetails);
    const parsedFlightDetails = JSON.parse(flightDetails);
    res.status(200).json({
      flight: parsedFlightDetails[flightNumber],
    });
  })

  .post("/users", async (req, res) => {
    const newUser = req.body;
    const options = {
      method: "POST",
      uri: "https://journeyedu.herokuapp.com/slingair/users",
      body: {
        email: newUser.email,
        flight: newUser.flight,
        givenName: newUser.givenName,
        surname: newUser.surname,
        email: newUser.email,
        seat: newUser.seat,
        // id: newUser.id,
      },
      json: true, // Automatically stringifies the body to JSON
    };

    const users = await request(
      "https://journeyedu.herokuapp.com/slingair/users"
    );

    const parsedUsers = JSON.parse(users);
    console.log("parsedRes", parsedUsers);

    if (parsedUsers.find((user) => user.email === newUser.email)) {
      res.status(404).json({ message: "user already registered" });
    } else {
      request(options)
        .then((response) => {
          console.log(response.reservation.id);
          res.status(201).json({ id: response.reservation.id });
        })
        .catch((err) => {
          res.status(400).json({ message: "this didn't work" });
        });
    }
  })

  // .post("/reservation", (req, res) => {
  //   const reservationID = req.body.id;
  // })

  .get("/users/:id", async (req, res) => {
    const id = req.params.id;
    const thisUserData = await request(
      `https://journeyedu.herokuapp.com/slingair/users/${id}`
    );
    const thisUser = JSON.parse(thisUserData);
    console.log(thisUser);
    // const parsedUsers = JSON.parse(users);
    // const thisUser = parsedUsers.find((user) => user.id === id);
    thisUser
      ? res.status(200).json({ user: thisUser.data })
      : res.status(404).json({ message: "not a user" });
  })

  .use((req, res) => res.send("Not Found"))
  .listen(8000, () => console.log(`Listening on port 8000`));
