<<<<<<< HEAD
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
=======
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res
    .status(200)
    .send("<h1>Welcome to the CI/CD Workshop!</h1>");
});

// ADD THIS
app.get("/time", (req, res) => {
  const now = new Date().toISOString();
  res.status(200).json({ time: now });
});

module.exports = app;
>>>>>>> feat/time
