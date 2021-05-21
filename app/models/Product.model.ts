import mongoose, { Schema } from 'mongoose';

interface Product {
    status: string,
    brand: string,
    uom: string,
    stock: number,
    priceTag: number,
    isAfterTax: string,
    barcode: string
}

interface ProductData extends mongoose.Document {
    status: string,
    brand: string, //populate = {name: misedap-karisoto, image: //google.gambar/misedap-karisoto}
    uom: string, //karton-40x1
    stock: number,
    priceTag: number,
    isAfterTax: string, //diisi otomatis dari delivery
    barcode: string //order_id.brand_id.uom
}

interface ProductInterface extends mongoose.Model<ProductData> {
    build(attr: Product): ProductData
}

const productSchema = new Schema({
    status: { type: String, default: "inactive" },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    uom: { type: String, required: true },
    stock: { type: Number, default: 0 },
    priceTag: { type: Number, required: true },
    isAfterTax: { type: String, required: true },
    barcode: { type: String, required: true }
}, { timestamps: true });

const Product = mongoose.model<ProductData, ProductInterface>('Product', productSchema)
export { Product }