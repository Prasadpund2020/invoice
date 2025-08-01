import mongoose from 'mongoose';

interface ISignature {
  name: string;
  image: string;
}

export interface ISettings {
  _id?: mongoose.Types.ObjectId;
  invoiceLogo?: string;
  signature?: ISignature;
  phone?: string;
  address1?: string;
  address2?: string;
  address3?: string;
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

const settingsSchema = new mongoose.Schema<ISettings>(
  {
    invoiceLogo: { type: String, default: null },
    signature: signatureSchema,
    phone: { type: String, default: null },
    address1: { type: String, default: null },
    address2: { type: String, default: null },
    address3: { type: String, default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

// ✅ Add index on userId for performance
settingsSchema.index({ userId: 1 });

// ✅ Cache model to prevent overwrite in hot reload
const SettingModel = mongoose.models.setting || mongoose.model('setting', settingsSchema);

export default SettingModel;
