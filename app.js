// app.js
const express = require("express");
const app = express();

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the CI/CD Workshop!");
});

// /time endpoint
app.get("/time", (req, res) => {
  res.json({ time: new Date().toISOString() });
});

// /health endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

module.exports = app;

const __lintFail = 123;
