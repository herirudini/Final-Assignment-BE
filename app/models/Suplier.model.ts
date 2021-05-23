import mongoose, { Schema } from 'mongoose';
const validator = require('mongoose-validators')

interface Suplier {
    suplier_name: string,
    contact: string,
    brands: string[]
}

interface SuplierData extends mongoose.Document {
    suplier_name: string, //pt.wingsfood-solokanjeruk
    contact: string, //wings-solokanjeruk@wingsfood.com
    brands: string[]
}

interface SuplierInterface extends mongoose.Model<SuplierData> {
    build(attr: Suplier): SuplierData
}

const suplierSchema = new Schema({
    suplier_name: { type: String, required: true },
    contact: {
        type: String,
        validate: validator.isNumeric(),
        required: true
    },
    brands: [{ type: String }],
}, { timestamps: true });

const Suplier = mongoose.model<SuplierData, SuplierInterface>('Suplier', suplierSchema)
export { Suplier }