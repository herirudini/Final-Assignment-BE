import mongoose, { Schema } from 'mongoose';
const validator = require('mongoose-validators')

interface Suplier {
    suplierName: string,
    contact: string,
    brands: string[]
}

interface SuplierData extends mongoose.Document {
    suplierName: string, //pt.wingsfood-solokanjeruk
    contact: string, //wings-solokanjeruk@wingsfood.com
    brands: string[]
}

interface SuplierInterface extends mongoose.Model<SuplierData> {
    build(attr: Suplier): SuplierData
}

const suplierSchema = new Schema({
    suplierName: { type: String, required: true },
    contact: {
        type: String,
        validate: validator.isNumeric(),
        required: true
    },
    brands: [{ type: Schema.Types.ObjectId, ref: 'Brand' }],
}, { timestamps: true });

const Suplier = mongoose.model<SuplierData, SuplierInterface>('Suplier', suplierSchema)
export { Suplier }