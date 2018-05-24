const express = require("express");

const http = require("http");
const reload = require("reload");

const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");

const routes = require("./server/routes/route.js");

const app = express();

mongoose.connect("mongodb://localhost/bookcab");

app.use(morgan("dev"));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "/client")));

app.use("/", routes);

const server = http.createServer(app);

// reload(app);
server.listen(3000, (req, res) => {
  console.log("Server is running ...");
});
