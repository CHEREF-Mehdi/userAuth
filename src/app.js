const express = require("express");
const routes = require("./routes");
const path = require("path");
const app = express();
const morgan = require("morgan");
const { verifyAccessTocken } = require("./helpers/jwt");
const User = require("./models/user");
//logger
app.use(morgan("tiny"));

//redis
require("./helpers/redis");

//data base
require("./helpers/db");

app.use(express.json());

// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//public routes
app.get("/", (req, res) => {
  return res.render("pages/index", { tab: 1 });
});

app.get("/login", (req, res, next) => {
  return res.render("pages/index", { tab: 2 });
});

app.get("/register", (req, res, next) => {
  return res.render("pages/index", { tab: 3 });
});

//protected routes
app.get("/admin", async (req, res, next) => {
  return res.render("pages/admin");
});

//api routes
app.use("/api", routes);

const PORT = process.env.API_PORT;

app.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});
