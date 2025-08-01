import mongoose from 'mongoose';

interface IUserInvoice {
    name: string;
    email: string;
    address1: string;
    address2?: string;
    address3?: string;
}
interface IItem {
    item_description: string;
    item_name: string;
    quantity: number;
    price: number;
    total: number;
}

export interface IInvoice {
    _id?: mongoose.Types.ObjectId;
    invoice_no: number; // ✅ CHANGED: was string, now number for sorting
    invoice_date: Date;
    due_date: Date;
    currency: string;
    from: IUserInvoice;
    to: IUserInvoice;
    items: IItem[];
    sub_total: number;
    discount: number;
    tax_percentage: number | null;
    total: number;
    notes?: string | null;
    status: string;
    created_at?: Date;
    updated_at?: Date;
    userId: mongoose.Types.ObjectId;
}

const Status = [
    "PENDING",
    "PAID",
    "CANCEL"
];

const UserInvoiceSchema = new mongoose.Schema<IUserInvoice>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String, default: null },
    address3: { type: String, default: null },
}, {
    _id: false
});

const itemSchema = new mongoose.Schema<IItem>({
    item_description: { type: String, default: null }, // ✅ Add this line

    item_name: { type: String, default: null, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true }
}, {
    _id: false
});

const InvoiceSchema = new mongoose.Schema<IInvoice>({
    invoice_no: { type: Number, required: true }, // ✅ CHANGED: was String, now Number
    invoice_date: { type: Date, required: true },
    due_date: { type: Date, required: true },
    currency: { type: String, required: true },
    from: { type: UserInvoiceSchema, required: true },
    to: { type: UserInvoiceSchema, required: true },
    items: { type: [itemSchema], required: true },
    sub_total: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax_percentage: { type: Number, default: 0 },
    total: { type: Number, default: 0, required: true },
    notes: { type: String, default: null },
    status: { type: String, enum: Status },
    userId: { type: mongoose.Schema.ObjectId, ref: "user", required: true }
}, {
    timestamps: true
});

// ✅ ADDED: Ensure unique invoice_no per user
InvoiceSchema.index({ userId: 1, invoice_no: 1 }, { unique: true });

const InvoiceModel = mongoose.models.invoice || mongoose.model('invoice', InvoiceSchema);
export default InvoiceModel;
