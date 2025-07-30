import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  name: string;
  email: string;
  address1: string;
  address2: string;
  address3: string;

  // Add timestamps fields to the interface
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String, required: true },
    address3: { type: String, required: true },
  },
  { timestamps: true }
);

// Avoid recompiling model on hot reload
export default mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema);
