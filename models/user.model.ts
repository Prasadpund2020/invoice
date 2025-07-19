import mongoose from 'mongoose';

interface IUser {
    _id?: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    emailVerified: Date | null;
    currency: string;
    role: 'user' | 'admin';   // ✅ Added role field
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Date, default: null },
    currency: { type: String, default: 'USD' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },  // ✅ Here
}, {
    timestamps: true,
});

const UserModel = mongoose.models.user || mongoose.model<IUser>('User', userSchema);

export default UserModel;
