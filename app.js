const express = require("express");
const path = require("path");
const passport = require("passport");
const cors = require("cors");
const usersRouter = require("./controllers/users");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const index = require("./index");
const port = process.env.PORT || 3001;

const app = express();
const mongoURI = "mongodb://localhost:27017/pinterest_clone" //or get from .env file
logger.info("connecting to db ",mongoURI);

// mongoose
//   .connect(mongoURI)
//   .then(() => {
//     logger.info("connected to MongoDB");
//   })
//   .catch((error) => {
//     logger.error("error connecting to MongoDB:", error.message);
//   });

app.use(cors());
app.use(express.json());

const connection=async()=>{
  mongoose.connect(mongoURI, {
    useNewUrlParser: true
  })
console.log("Mongodb is connected")
}
connection()
app.listen(port, () => {
console.log(`Server is running on port: ${port}`);
});



app.use(passport.initialize());
require("./utils/passport")(passport);

app.use(middleware.requestLogger);

app.use("/api/Users", usersRouter);

if (process.env.NODE_ENV === "production") {
  const buildPath = path.resolve(__dirname, "..", "client", "build");
  app.use(express.static(buildPath));
  app.get("*", (request, response) => {
    response.sendFile(path.join(buildPath, "index.html"));
  });
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = index;