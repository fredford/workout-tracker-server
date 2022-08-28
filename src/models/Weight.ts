// Library imports
import mongoose, { Types } from "mongoose";

export type WeightDocument = mongoose.Document & {
  _id: Types.ObjectId;
  date: Date;
  amount: number;
  user: Types.ObjectId;

  removeOne: (this: WeightDocument) => void;
};

const WeightSchema = new mongoose.Schema<WeightDocument>({
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

WeightSchema.methods.removeOne = async function (this: WeightDocument) {
  this.deleteOne();
};

const Weight = mongoose.model<WeightDocument>("Weight", WeightSchema);

export default Weight;
