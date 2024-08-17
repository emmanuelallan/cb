import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  current: { type: Number, default: 0 },
  target: { type: Number, default: 0 },
});

const Goal = mongoose.models.Goal || mongoose.model("Goal", goalSchema);

export default Goal;
