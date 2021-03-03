var mongoose = require("mongoose");

var db_host = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

var options = {
  useUnifiedTopology: true,
};

mongoose
  .connect(db_host, { useNewUrlParser: true, ...options })
  .then((res) => console.log("connected to database cimayakerdb successfully"))
  .catch((err) => console.log("error in connecting to database"));
