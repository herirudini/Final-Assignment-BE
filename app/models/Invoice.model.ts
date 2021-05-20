import mongoose, { Schema } from 'mongoose';
const validator = require('mongoose-validators')

interface Invoice {
    status: string,
    suplier_id: string
    orders: object[],
    paid: number, //dihitung setiap kedatangan barang (up-date)
    totalPayment: number,
    date: object,
}

interface InvoiceData extends mongoose.Document {
    status: string, //on-process, finish
    suplier_id: string
    orders: object[], //pupulate order
    paid: number, //++ setiap kedatangan barang (up-date)
    totalPayment: number,
    date: object,
}

interface InvoiceInterface extends mongoose.Model<InvoiceData> {
    build(attr: Invoice): InvoiceData
}

const invoiceSchema = new Schema({
    status: {type: String},
    suplier_id: { type: String },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }], 
    paid: { type: Number },
    totalPayment: { type: Number },
    date: {
        day: {type: String},
        month: {type: String},
        year: {type: String}
    },
}, { timestamps: true });

const Invoice = mongoose.model<InvoiceData, InvoiceInterface>('Invoice', invoiceSchema)
export { Invoice }