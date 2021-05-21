import mongoose, { Schema } from 'mongoose';
const validator = require('mongoose-validators')

interface Brand {
    name: string,
    products: string[],
}

interface BrandData extends mongoose.Document {
    name: string, //misedap
    products: string[], //karisoto, migoreng, rendang
}

interface BrandInterface extends mongoose.Model<BrandData> {
    build(attr: Brand): BrandData
}

const brandSchema = new Schema({
    name: { type: String, required: true },
    products: [{ type: String, required: true }]
}, { timestamps: true });

const Brand = mongoose.model<BrandData, BrandInterface>('Brand', brandSchema)
export { Brand }