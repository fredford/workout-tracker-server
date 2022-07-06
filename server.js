import express from "express";
import cors from "cors";

import mongoose from "mongoose";

import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSMongoose from "@adminjs/mongoose";

import dotenv from "dotenv";

import bcrypt from "bcryptjs";
import routes from "./routes/routes.js";
import privateRoutes from "./routes/private.js";
import userRoutes from "./routes/user.js";
import exercisesRoutes from "./routes/exercises.js";
import workoutsRoutes from "./routes/workouts.js";
import workoutRoutes from "./routes/workout.js";
import setRoutes from "./routes/sets.js";
import statsRoutes from "./routes/stats.js";

import errorHandler from "./middleware/error.js";
import User from "./models/User.js";
import router from "./routes/sets.js";

dotenv.config({ path: "./.env" });

const app = express();

// Register the Mongoose Adapter
AdminJS.registerAdapter(AdminJSMongoose);

// Run AdminJS with Mongoose
const connectDB = async () => {
  const mongooseDb = await mongoose.connect(process.env.WORKOUTTRACKER_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const adminJs = new AdminJS({ databases: [mongooseDb], rootPath: "/admin" });
  const adminJSrouter = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate: async (email, password) => {
        if (email === "admin@admin.com") {
          const user = await User.findOne({ email: "admin@admin.com" }).select(
            "+password"
          );

          const isMatch = await user.matchPasswords(password);

          if (isMatch) {
            return user;
          }
          return false;
        }
      },
      cookiePassword: "some-secret-password",
    },
    null,
    {
      resave: false,
      saveUninitialized: true,
    }
  );

  app.use(adminJs.options.rootPath, adminJSrouter);
  console.log("MongoDB connected");
};

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/v1", routes);
app.use("/api/v1/private", privateRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", exercisesRoutes);
app.use("/api/v1", workoutsRoutes);
app.use("/api/v1", workoutRoutes);
app.use("/api/v1", setRoutes);
app.use("/api/v1", statsRoutes);

// Error Handler (last piece of middleware added)
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const server = app.listen(
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`)),
  app.listen(8080, () => console.log("AdminJS is under localhost:8080/admin"))
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err}`);
  server.close(() => process.exit(1));
});

export default app;
