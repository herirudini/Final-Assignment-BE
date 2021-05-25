import mongoose, { Schema } from 'mongoose';

interface Receipt {
    items: object[],
    tax: number,
    subtotal: number,
}

interface ReceiptData extends mongoose.Document {
    items: object[],
    tax: number,
    subtotal: number,
}

interface ReceiptInterface extends mongoose.Model<ReceiptData> {
    build(attr: Receipt): ReceiptData
}

const receiptSchema = new Schema({
    items: [{ type: Object }],
    tax: { type: Number },
    subtotal: { type: Number },
}, { timestamps: true });

const Receipt = mongoose.model<ReceiptData, ReceiptInterface>('Receipt', receiptSchema)
export { Receipt }