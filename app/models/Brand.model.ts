import mongoose, { Schema } from 'mongoose';
const validator = require('mongoose-validators')

interface Brand {
    name: string,
    image: string[],
}

interface BrandData extends mongoose.Document {
    name: string, //misedap-karisoto
    image: string[], //google.gambar/misedap-karisoto
}

interface BrandInterface extends mongoose.Model<BrandData> {
    build(attr: Brand): BrandData
}

const brandSchema = new Schema({
    name: { type: String, required: true },
    image: [{ type: String, required: true }]
}, { timestamps: true });

const Brand = mongoose.model<BrandData, BrandInterface>('Brand', brandSchema)
export { Brand }