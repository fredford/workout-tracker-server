import express from "express";
import cors from "cors";

import mongoose from "mongoose";

import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSMongoose from "@adminjs/mongoose";

import dotenv from "dotenv";

import routes from "./routes/routes.js";

import errorHandler from "./middleware/error.js";
import User from "./models/User.js";

dotenv.config({ path: "./.env" });

const version = "/api/v1";

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

// Set CORS
app.use(cors());
app.use(express.json());

// Instantiate all set routes
routes.forEach((route) => app.use(version, route));

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
