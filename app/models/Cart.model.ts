import mongoose, { Schema } from 'mongoose';

interface Cart {
    status: string,
    admin_id: string,
    product_id: string,
    product: string,
    quantity: number,
    price: number,
    tax: number,
    totalPrice: number,
    notes: string,
}

interface CartData extends mongoose.Document {
    status: string, //on-process, cancel, success
    admin_id: string,
    product_id: string,
    product: string,
    quantity: number,
    price: number,
    tax: number,
    totalPrice: number,
    notes: string, //input cancel reason
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
    notes: { type: String, select: false },
}, { timestamps: true });

const Cart = mongoose.model<CartData, CartInterface>('Cart', cartSchema)
export { Cart }