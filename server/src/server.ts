import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

const port = process.env.PORT || env.PORT || 5000;
const mongoUrl = process.env.MONGO_CONNECTION_URL || env.MONGO_CONNECTION_URL;
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Mongoose connected");
    app.listen(port, () => {
      console.log("server running on port: " + port);
    });
  })
  .catch(console.error);
