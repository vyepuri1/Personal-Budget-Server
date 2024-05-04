const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
require("dotenv").config();
const mongoose = require("mongoose");

const requestIp = require("request-ip");
const { router: Auth } = require("./auth");
const Budget = require("./budget");

const { Authenticate } = require("./auth");

mongoose.connect(
  "mongodb+srv://DFqqXNSw5ir3cTSa:DFqqXNSw5ir3cTSa@cluster0.4f2tddf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);
const db = mongoose.connection;
db.on("error", (error) => {
  console.error("Connection error:", error);
});
db.once("open", () => {
  console.log("Connected to the database");
});

app.use(express.json());
app.use(requestIp.mw());
app.use(express.urlencoded({ extended: false }));


app.get("/", (req, res) => {
  res.json({
    message: "Now Budget server working",
  });
});

app.use("/auth", Auth);
app.use("/budget", Authenticate, Budget);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next();
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message,
  });
});

// server
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
