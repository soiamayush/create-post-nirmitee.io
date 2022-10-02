const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser") // added while implementing cloudinary


app.use(cors());
app.use(cookieParser());

const errorMiddleware = require("./middlewares/error");
app.use(express.json());

app.use(bodyParser.json());

const post = require("./routes/post");
const auth = require("./routes/auth");

app.use("/api/v1", auth);
app.use("/api/v1", post);

app.use(errorMiddleware);

module.exports = app;
