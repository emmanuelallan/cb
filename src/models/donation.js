import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true },
  message: String,
  amount: { type: Number, required: true },
  chaiCount: Number,
  isPrivate: Boolean,
  paypalEmail: String,
  transactionId: { type: String, required: true },
  paymentMethod: String,
  createdAt: { type: Date, default: Date.now },
});

const Donation =
  mongoose.models.Donation || mongoose.model("Donation", donationSchema);

export default Donation;
