import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.WORKOUTTRACKER_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("MongoDB connected");
};

export default connectDB;
