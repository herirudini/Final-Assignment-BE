import mongoose, { Schema } from 'mongoose';

interface Invoice {
    status: string,
    suplier_id: string,
    orders: string[],
    bill: number,
    date: object,
}

interface InvoiceData extends mongoose.Document {
    status: string, //unpaid, paid
    suplier_id: string,
    orders: string[], 
    bill: number,
    date: object,
}

interface InvoiceInterface extends mongoose.Model<InvoiceData> {
    build(attr: Invoice): InvoiceData
}

const invoiceSchema = new Schema({
    status: {type: String, default: "unpaid"},
    suplier_id: { type: String },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }], 
    bill: { type: Number },
    date: {
        day: {type: String},
        month: {type: String},
        year: {type: String}
    },
}, { timestamps: true });

const Invoice = mongoose.model<InvoiceData, InvoiceInterface>('Invoice', invoiceSchema)
export { Invoice }