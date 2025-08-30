import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

const port = env.PORT || 10000;

mongoose
  .connect(env.MONGO_CONNECTION_URL)
  .then(() => {
    console.log("Mongoose connected");
    app.listen(port, () => {
      console.log("server running on port: " + port);
    });
  })
  .catch(console.error);
