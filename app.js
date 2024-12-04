const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const sequelize = require("./utils/database");
const cors = require("cors");
const userRoute = require("./routes/user");
const path = require("path");
const user = require("./models/user");
const dotenv = require("dotenv");
dotenv.config();
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoute);

app.use(cors());

sequelize
  .sync()
  .then((result) => {
    app.listen(4000);
  })
  .catch((err) => console.log(err));
