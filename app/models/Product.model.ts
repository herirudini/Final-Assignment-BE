import mongoose, { Schema } from 'mongoose';

interface Product {
    order_id: string,
    brand: string,
    uom: string,
    stock: number,
    priceTag: number,
    discount: number,
    barcode: string
}

interface ProductData extends mongoose.Document {
    order_id: string,
    brand: string, //populate = {name: misedap-karisoto, image: //google.gambar/misedap-karisoto}
    uom: string, //karton-40x1
    stock: number,
    priceTag: number,
    discount: number,
    barcode: string //order_id.brand_id.uom
}

interface ProductInterface extends mongoose.Model<ProductData> {
    build(attr: Product): ProductData
}

const productSchema = new Schema({
    order_id: { type: String, required: true },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    uom: { type: String, required: true },
    stock: { type: Number, default: 0 },
    priceTag: { type: Number, required: true },
    discount: { type: Number, default: 0},
    barcode: { type: String, required: true }
}, { timestamps: true });

const Product = mongoose.model<ProductData, ProductInterface>('Product', productSchema)
export { Product }