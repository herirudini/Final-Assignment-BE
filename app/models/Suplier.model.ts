import mongoose, { Schema } from 'mongoose';
const validator = require('mongoose-validators')

interface Suplier {
    name: string,
    contact: string,
}

interface SuplierData extends mongoose.Document {
    name: string, //pt.wingsfood-solokanjeruk
    contact: string, //wings-solokanjeruk@wingsfood.com
}

interface SuplierInterface extends mongoose.Model<SuplierData> {
    build(attr: Suplier): SuplierData
}

const suplierSchema = new Schema({
    name: { type: String, required: true },
    contact: {
        type: String,
        validate: validator.isNumeric(),
        required: true
    },
}, { timestamps: true });

const Suplier = mongoose.model<SuplierData, SuplierInterface>('Suplier', suplierSchema)
export { Suplier }