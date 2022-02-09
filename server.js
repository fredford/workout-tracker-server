import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import routes from "./routes/routes.js";
import privateRoutes from "./routes/private.js";
import userRoutes from "./routes/user.js";

import errorHandler from "./middleware/error.js";

dotenv.config({ path: "./.env" });

// Connect to MongoD
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", routes);
app.use("/api/v1/private", privateRoutes);
app.use("/api/v1", userRoutes);

// Error Handler (last piece of middleware added)
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const server = app.listen(
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err}`);
  server.close(() => process.exit(1));
});

export default app;
