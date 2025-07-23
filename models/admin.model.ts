// models/admin.model.ts
import  { Schema, models, model } from "mongoose";

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
  },
  { timestamps: true }
);

export default models.Admin || model("Admin", AdminSchema);
