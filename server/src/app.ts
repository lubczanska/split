import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import expensesRoutes from "./routes/expenses";
import createHttpError, { isHttpError } from "http-errors";

const app = express();
app.use(express.json());

app.use("/api/expenses", expensesRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMsg = "An unknown error has ocurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMsg = error.message;
  }
  res.status(statusCode).json({ error: errorMsg });
});

export default app;
