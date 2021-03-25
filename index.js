const express = require("express");
const app = express();
const passport = require("passport");
const cookie = require("cookie-session");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
require("./passport");
mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));
if (process.env.NODE_ENV == "production")
  app.use(express.static(path.join(__dirname, "/client/build")));
app.use(express.json());
app.use(
  cookie({
    name: "dashboard-token",
    maxAge: 72 * 60 * 60 * 1000, // token will expire after 72 hours
    keys: [process.env.COOKIE_SECRET],
    httpOnly: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api", require("./src/routes"));
if (process.env.NODE_ENV == "production")
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname + "/client/build/index.html"))
  );

app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log(`App listening on port ${process.env.PORT || 5000}`);
  console.log("Press Ctrl+C to quit.");
});
