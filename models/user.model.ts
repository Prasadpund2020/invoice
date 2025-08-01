import { Schema, models, model, Document } from "mongoose";

// ✅ Updated interface
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: Date | null;
  currency: string;
  role: 'user' | 'admin';
  hashedPassword: string;
  logo?: string;
  phone?: string;
  streetAddress?: string;   // ✅ Renamed
  city?: string;            // ✅ Renamed
  postalCode?: string;      // ✅ Renamed
  signature?: {
    name: string;
    image: string;
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

    logo: { type: String, default: null },
    phone: { type: String, default: null },

    // ✅ Address fields as top-level properties
    streetAddress: { type: String, default: null },
    city: { type: String, default: null },
    postalCode: { type: String, default: null },

    signature: {
      name: { type: String, default: '' },
      image: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError in Next.js dev
const UserModel = models.User || model<IUser>('User', userSchema);

export default UserModel;
