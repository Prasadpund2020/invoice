import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  _id: string;
  name: string;
  email: string;
  address1: string;
  address2: string;
  address3: string;
  createdAt: Date;
  updatedAt: Date;
  user: mongoose.Types.ObjectId; // ✅ Correct type here
}

const ClientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String, required: true },
    address3: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // ✅ No error now
  },
  { timestamps: true }
);

// Avoid recompiling model on hot reload
export default mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema);
