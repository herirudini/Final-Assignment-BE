import mongoose, { Schema } from 'mongoose';
const validator = require('mongoose-validators')

interface Suplier {
    suplier_name: string,
    contact: string,
    address: string,
    brands: string[]
}

interface SuplierData extends mongoose.Document {
    suplier_name: string, //pt.wingsfood-solokanjeruk
    contact: string, //wings-solokanjeruk@wingsfood.com
    address: string,
    brands: string[]
}

interface SuplierInterface extends mongoose.Model<SuplierData> {
    build(attr: Suplier): SuplierData
}

const suplierSchema = new Schema({
    suplier_name: { type: String, required: true },
    contact: {
        type: String,
        required: true
    },
    address: { type: String },
    brands: [{ type: String }],
}, { timestamps: true });

const Suplier = mongoose.model<SuplierData, SuplierInterface>('Suplier', suplierSchema)
export { Suplier }