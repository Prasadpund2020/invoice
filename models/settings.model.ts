import mongoose from 'mongoose';

interface ISignature {
  name: string;
  image: string;
}

export interface ISettings {
  _id?: mongoose.Types.ObjectId;
  invoiceLogo?: string;
  signature?: ISignature;
  phone?: string; // ✅ Add this to the interface
  userId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const signatureSchema = new mongoose.Schema<ISignature>(
  {
    name: { type: String, default: null },
    image: { type: String, default: null },
  },
  {
    _id: false,
  }
);

// ✅ Add `phone` here
const settingsSchema = new mongoose.Schema<ISettings>(
  {
    invoiceLogo: { type: String, default: null },
    signature: signatureSchema,
    phone: { type: String, default: null }, // ✅ Here
    userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

// ✅ Model caching for dev environments
const SettingModel = mongoose.models.setting || mongoose.model('setting', settingsSchema);

export default SettingModel;
