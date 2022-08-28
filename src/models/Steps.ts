// Library imports
import mongoose, { Types } from "mongoose";

export type StepsDocument = mongoose.Document & {
  _id: Types.ObjectId;
  date: Date;
  amount: number;
  user: Types.ObjectId;

  removeOne: (this: StepsDocument) => void;
};

const StepsSchema = new mongoose.Schema<StepsDocument>({
  date: {
    type: Date,
    default: () => Date.now(),
  },
  amount: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

StepsSchema.methods.removeOne = async function (this: StepsDocument) {
  this.deleteOne();
};

const Steps = mongoose.model<StepsDocument>("Steps", StepsSchema);

export default Steps;
