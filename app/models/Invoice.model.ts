import mongoose, { Schema } from 'mongoose';
const validator = require('mongoose-validators')

interface Invoice {
    status: string,
    suplier_id: string
    orders: object[],
    paid: number, //dihitung setiap kedatangan barang (up-date)
    unpaid: number, //dihitung setiap kedatangan barang (up-date)
    total: number,
    date: object,
}

interface InvoiceData extends mongoose.Document {
    status: string, //on-process, finish
    suplier_id: string
    orders: object[], //dipush dari get order by id
    paid: number, //dihitung setiap kedatangan barang (up-date)
    unpaid: number, //dihitung setiap kedatangan barang (up-date)
    total: number,
    date: object,
}

interface InvoiceInterface extends mongoose.Model<InvoiceData> {
    build(attr: Invoice): InvoiceData
}

const invoiceSchema = new Schema({
    status: {type: String},
    suplier_id: { type: String },
    orders: [{ type: Object }], 
    paid: { type: Number },
    unpaid: { type: Number },
    total: { type: Number },
    date: {
        day: {type: String},
        month: {type: String},
        year: {type: String}
    },
}, { timestamps: true });

const Invoice = mongoose.model<InvoiceData, InvoiceInterface>('Invoice', invoiceSchema)
export { Invoice }