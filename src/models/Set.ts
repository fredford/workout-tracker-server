// Library imports
import mongoose, { Types } from "mongoose";

export type SetDocument = mongoose.Document & {
  _id: Types.ObjectId;
  date: Date;
  workout: Types.ObjectId;
  exercise: Types.ObjectId;
  user: Types.ObjectId;
  amount: string;
};

// Model Schema for Sets
const SetSchema = new mongoose.Schema<SetDocument>({
  date: {
    type: Date,
    default: () => Date.now(),
  },
  workout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workout",
    required: true,
  },
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Set = mongoose.model("Set", SetSchema);

export default Set;
