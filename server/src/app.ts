import "dotenv/config";
import express, { Request, Response } from "express";
import expensesRoutes from "./routes/expenses";
import userRoutes from "./routes/users";
import groupRoutes from "./routes/groups";
import createHttpError, { isHttpError } from "http-errors";
// import cors from "cors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";

const app = express();
app.use(express.json());

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24h
      secure: false,
    },
    rolling: true,
    store: MongoStore.create({ mongoUrl: env.MONGO_CONNECTION_URL }),
  })
);

// app.use(cors({ credentials: true, origin: true }));

app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/expenses", expensesRoutes);

app.use((_req, _res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

app.use((error: unknown, _req: Request, res: Response) => {
  console.error(error);
  let errorMsg = "An unknown error has ocurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMsg = error.message;
  }
  res.status(statusCode).json({ error: errorMsg });
});

app.listen(env.PORT, () => {
  console.log(`Example app listening on port ${env.PORT}`);
});

export default app;
