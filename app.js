require("dotenv").config();
const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const routers = require("./routes/index.routes");
const connectDB = require("./configs/db");
const app = express();
const cors = require("cors");

// DB connect
connectDB();

// cors init
app.use(cors());

// morgan init
app.use(morgan("dev"));

// body-parser middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
	bodyParser.urlencoded({
		limit: "50mb",
		extended: true,
		parameterLimit: 50000,
	})
);

// routes
routers(app);

module.exports = app;
