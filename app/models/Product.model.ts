import mongoose, { Schema } from 'mongoose';

interface Product {
    status: string,
    suplier_name: string,
    brand_name: string,
    product_name: string,
    image: any,
    uom: string,
    stock: number,
    buyPrice: number,
    sellPrice: number,
    isAfterTax: string,
    barcode: string
}

interface ProductData extends mongoose.Document {
    status: string, //active atau inactive
    suplier_name: string,
    brand_name: string, //populate = {product_name: misedap-karisoto, image: //google.gambar/misedap-karisoto}
    product_name: string,
    image: any,
    uom: string, //karton-40x1
    stock: number,
    buyPrice: number,
    sellPrice: number,
    isAfterTax: string, //yes or no
    barcode: string //order_id.brand_name.uom
}

interface ProductInterface extends mongoose.Model<ProductData> {
    build(attr: Product): ProductData
}

const productSchema = new Schema({
    status: { type: String, default: "inactive" },
    suplier_name: { type: String, required: true },
    brand_name: { type: String, required: true },
    product_name: { type: String, required: true },
    image: { type: Buffer, required: true },
    uom: { type: String, required: true },
    stock: { type: Number, default: 0 },
    buyPrice: { type: Number },
    sellPrice: { type: Number, required: true },
    isAfterTax: { type: String },
    barcode: { type: String, required: true }
}, { timestamps: true });
productSchema.index({ product_name: 'text', brand_name: 'text', uom: 'text', suplier_name: 'text' },
    { weights: { product_name: 5, brand_name: 4, uom: 3, suplier_name: 1 } });

const Product = mongoose.model<ProductData, ProductInterface>('Product', productSchema)
export { Product }