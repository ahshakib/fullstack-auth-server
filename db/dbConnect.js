const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true
    })
    .then(() => {
      console.log("Database Connected!");
    })
    .catch((error) => {
      console.log("Unable to connect");
      console.error(error);
    });
}

module.exports = dbConnect;
