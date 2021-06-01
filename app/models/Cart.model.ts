import mongoose, { Schema } from 'mongoose';

interface Cart {
    status: string,
    admin_id: string,
    product_id: string,
    brand_name: string,
    product_name: string,
    uom: string,
    quantity: number,
    price: number,
    tax: number,
    totalPrice: number,
    notes: string,
    date: any,
}

interface CartData extends mongoose.Document {
    status: string, //on-process, cancel, sold
    admin_id: string,
    product_id: string,
    brand_name: string,
    product_name: string,
    uom: string,
    quantity: number,
    price: number,
    tax: number,
    totalPrice: number,
    notes: string, //input cancel reason
    date: any,
}

interface CartInterface extends mongoose.Model<CartData> {
    build(attr: Cart): CartData
}

const cartSchema = new Schema({
    status: { type: String, default: "on-process" },
    admin_id: { type: Schema.Types.ObjectId, ref: 'User' },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
    product: { type: String },
    quantity: { type: Number, default: 1 },
    price: { type: Number },
    tax: { type: Number },
    totalPrice: { type: Number },
    notes: { type: String },
    date: { type: Date, default: Date.now() },
});

const Cart = mongoose.model<CartData, CartInterface>('Cart', cartSchema)
export { Cart }