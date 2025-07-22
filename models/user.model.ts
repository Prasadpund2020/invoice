import  { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    emailVerified: Date | null;
    currency: string;
    role: 'user' | 'admin';
    hashedPassword: string;
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
    },
    { timestamps: true }
);

// ✅ Correct caching to prevent OverwriteModelError
const UserModel = models.User || model<IUser>('User', userSchema);

export default UserModel;
