import mongoose, { Schema } from 'mongoose';
const validator = require('mongoose-validators')

interface Brand {
    brandName: string,
    products: string[],
}

interface BrandData extends mongoose.Document {
    brandName: string, //misedap
    products: string[], //id id products
}

interface BrandInterface extends mongoose.Model<BrandData> {
    build(attr: Brand): BrandData
}

const brandSchema = new Schema({
    brandName: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

const Brand = mongoose.model<BrandData, BrandInterface>('Brand', brandSchema)
export { Brand }