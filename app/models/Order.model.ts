import mongoose, { Schema } from 'mongoose';

interface Order {
    status: string,
    suplier_name: string,
    product_id: string,
    product_name: string,
    brand_name: string,
    uom: string,
    buyPrice: number,
    discount: number,
    quantity: number,
    subTotal: number,
    arrived: number,
    isAfterTax: string,
}

interface OrderData extends mongoose.Document {
    status: string, //requested, accepted (sudah di acc jadi invoice), completed (barang sudah sampai semua)
    suplier_name: string, //pt.wingsfood-solokanjeruk
    product_id: string, //karisoto
    product_name: string,
    brand_name: string, //misedap
    uom: string, //karton-40x1
    buyPrice: number, //harga beli
    discount: number,
    quantity: number,
    subTotal: number,
    arrived: number, //jika arrived == quantity maka status = finish
    isAfterTax: string,
}

interface OrderInterface extends mongoose.Model<OrderData> {
    build(attr: Order): OrderData
}

const orderSchema = new Schema({
    status: { type: String, default: "on-process" },
    suplier_name: { type: String, required: true },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    product_name: { type: String, required: true },
    brand_name: { type: String, required: true },
    uom: { type: String, required: true },
    buyPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    quantity: { type: Number, required: true },
    subTotal: { type: Number },
    arrived: { type: Number, default: 0 },
    isAfterTax: { type: String, default: "yes" },
}, { timestamps: true });

const Order = mongoose.model<OrderData, OrderInterface>('Order', orderSchema)
export { Order }