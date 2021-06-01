import mongoose, { Schema } from 'mongoose';

interface Receipt {
    items: object[],
    totalTax: number,
    subtotal: number,
    date: any,
}

interface ReceiptData extends mongoose.Document {
    items: object[],
    totalTax: number,
    subtotal: number,
    date: any,
}

interface ReceiptInterface extends mongoose.Model<ReceiptData> {
    build(attr: Receipt): ReceiptData
}

const receiptSchema = new Schema({
    items: [{ type: Object }],
    totalTax: { type: Number },
    subtotal: { type: Number },
    date: { type: Date, default: Date.now },
});

const Receipt = mongoose.model<ReceiptData, ReceiptInterface>('Receipt', receiptSchema)
export { Receipt }