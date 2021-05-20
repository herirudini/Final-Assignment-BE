import mongoose, { Schema } from 'mongoose';
const validator = require('mongoose-validators')

interface Order {
    status: string,
    suplier_id: string,
    brand_id: string,
    uom: string,
    quantity: number,
    arrived: number,
    discount: number,
    price: number,
    profit: number,
}

interface OrderData extends mongoose.Document {
    status: string, //requested, accepted (sudah di acc jadi invoice), finish (barang sudah sampai semua)
    suplier_id: string, //pt.wingsfood-solokanjeruk
    brand_id: string, //misedap-karisoto
    uom: string, //karton-40x1
    quantity: number,
    arrived: number, //jika arrived == quantity maka status = finish
    discount: number,
    price: number, //harga beli
    profit: number, //presentasi laba yang diinginkan (ini akan menentukan harga jual)
}

interface OrderInterface extends mongoose.Model<OrderData> {
    build(attr: Order): OrderData
}

const orderSchema = new Schema({
    status: { type: String, default: "requested" },
    suplier_id: { type: String, required: true },
    brand_id: { type: String, required: true },
    uom: { type: String, required: true },
    quantity: { type: Number },
    arrived: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
}, { timestamps: true });

const Order = mongoose.model<OrderData, OrderInterface>('Order', orderSchema)
export { Order }