var mongoose = require("mongoose");

var db_host = `mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}`;

var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false,
  useCreateIndex:true
};

mongoose
  .connect(db_host, options)
  .then((res) => console.log("connected to database successfully"))
  .catch((err) => console.log("error in connecting to database"));
