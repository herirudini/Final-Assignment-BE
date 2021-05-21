import mongoose, { Schema } from 'mongoose';

interface Product {
    status: string,
    brand_id: string,
    name: string,
    image: string,
    uom: string,
    stock: number,
    buyPrice: number,
    sellPrice: number,
    isAfterTax: string,
    barcode: string
}

interface ProductData extends mongoose.Document {
    status: string, //active atau inactive
    brand_id: string, //populate = {name: misedap-karisoto, image: //google.gambar/misedap-karisoto}
    name: string,
    image: string,
    uom: string, //karton-40x1
    stock: number,
    buyPrice: number,
    sellPrice: number,
    isAfterTax: string, //yes or no
    barcode: string //order_id.brand_id.uom
}

interface ProductInterface extends mongoose.Model<ProductData> {
    build(attr: Product): ProductData
}

const productSchema = new Schema({
    status: { type: String, default: "inactive" },
    brand_id: { type: Schema.Types.ObjectId, ref: 'Brand' },
    name: { type: String, required: true },
    image: { type: String, required: true },
    uom: { type: String, required: true },
    stock: { type: Number, default: 0 },
    buyPrice: { type: Number, required: true },
    sellPrice: { type: Number, required: true },
    isAfterTax: { type: String, required: true },
    barcode: { type: String, required: true }
}, { timestamps: true });

const Product = mongoose.model<ProductData, ProductInterface>('Product', productSchema)
export { Product }