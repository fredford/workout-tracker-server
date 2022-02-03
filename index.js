import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";

import ExercisesDAO from "./dao/exercisesDAO.js";

// Load ENV file
dotenv.config();

// Initiate Mongo Client
const MongoClient = mongodb.MongoClient;

// Set ENV port
const port = process.env.port || 8000;

MongoClient.connect(process.env.WORKOUTTRACKER_DB_URI, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
  useNewUrlParser: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await ExercisesDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  });
