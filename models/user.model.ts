import { Schema, models, model, Document } from "mongoose";

// ✅ Updated interface to include logo, phone, signature
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: Date | null;
  currency: string;
  role: 'user' | 'admin';
  hashedPassword: string;
  logo?: string; // ✅ Base64 string
  phone?: string; // ✅ Optional phone
  signature?: {
    name: string;
    image: string; // Base64
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Date, default: null },
    currency: { type: String, default: 'USD' },
    hashedPassword: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    // ✅ New fields added to the schema
    logo: { type: String, default: null },
    phone: { type: String, default: null },
    signature: {
      name: { type: String, default: '' },
      image: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

// ✅ Avoid OverwriteModelError
const UserModel = models.User || model<IUser>('User', userSchema);

export default UserModel;
