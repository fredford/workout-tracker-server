// Library imports
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSMongoose from "@adminjs/mongoose";
import dotenv from "dotenv";

// Mongoose Models
import { User, UserDocument } from "./models/User";
// Server routes
import routes from "./routes/routes";
// Middleware
import errorTransmission from "./middleware/errorTransmission";
// Utilities
import { version } from "./utils/variables";
// Read the environment variables
dotenv.config({ path: "./.env" });

// Instantiate the application with Express
const app = express();

// Register the Mongoose Adapter
AdminJS.registerAdapter(AdminJSMongoose);

// Run AdminJS with Mongoose
const connectDB = async () => {
  const mongooseDb = await mongoose.connect(
    process.env.WORKOUTTRACKER_DB_URI ?? ""
  );

  // Connect the database to AdminJS for the backend dashboard
  const adminJs = new AdminJS({ databases: [mongooseDb], rootPath: "/admin" });
  const adminJSrouter = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      // The only authenticated account for admin access is admin@admin.com
      authenticate: async (email, password) => {
        if (email === "admin@admin.com") {
          const user = (await User.findOne({ email: "admin@admin.com" }).select(
            "+password"
          )) as any;

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
  // Add AdminJS routes to the application
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
app.use(errorTransmission);
// Set the server port
const PORT = process.env.PORT || 8000;
// If the server is in "test" mode don't listen for normal usage
if (process.env.NODE_ENV !== "test") {
  const index = app.listen(PORT, () => {
    console.log(`Server on ${PORT}`);
  });
  const adminIndex = app.listen(8080, () => {
    console.log(`Admin on ${PORT}`);
  });

  process.on("unhandledRejection", (err, promise) => {
    console.log(`Logged Error: ${err}`);
    adminIndex.close(() => process.exit(1));
    index.close(() => process.exit(1));
  });
}

export default app;
