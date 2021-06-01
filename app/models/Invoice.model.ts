import mongoose, { Schema } from 'mongoose';

interface Invoice {
    status: string,
    suplier_name: string,
    orders: string[],
    bill: number,
}

interface InvoiceData extends mongoose.Document {
    status: string, //unpaid, paid
    suplier_name: string,
    orders: string[], 
    bill: number,
}

interface InvoiceInterface extends mongoose.Model<InvoiceData> {
    build(attr: Invoice): InvoiceData
}

const invoiceSchema = new Schema({
    status: {type: String, default: "unpaid"},
    suplier_name: { type: String, required: true },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }], 
    bill: { type: Number },
}, { timestamps: true });

const Invoice = mongoose.model<InvoiceData, InvoiceInterface>('Invoice', invoiceSchema)
export { Invoice }