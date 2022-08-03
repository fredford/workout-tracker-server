import mongoose from "mongoose";
import Set from "./Set.js";

// Model Schema for Exercises
const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  area: {
    type: String,
    required: [true, "Please provide a body area"],
  },
  type: {
    type: String,
    required: [true, "Please provide the workout quantifier type"],
    enum: ["Repetitions", "Duration"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: [true, "Please provide if set by an Admin"],
  },
});

// Upon Exercise deletion remove all Sets associated to that Exercise
ExerciseSchema.pre("deleteOne", { document: true }, function (next) {
  Set.deleteMany({ exercise: { _id: this._id } })
    .then(function () {})
    .catch(function (error) {
      console.log(error);
    });
  next();
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

export default Exercise;
