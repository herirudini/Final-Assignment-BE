import mongoose, { Schema } from 'mongoose';
const validator = require('mongoose-validators')

interface Brand {
    name: string,
    products: string[],
}

interface BrandData extends mongoose.Document {
    name: string, //misedap
    products: string[], //id id products
}

interface BrandInterface extends mongoose.Model<BrandData> {
    build(attr: Brand): BrandData
}

const brandSchema = new Schema({
    name: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

const Brand = mongoose.model<BrandData, BrandInterface>('Brand', brandSchema)
export { Brand }