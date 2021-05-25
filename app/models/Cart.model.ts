import mongoose, { Schema } from 'mongoose';

interface Cart {
    status: string,
    admin_id: string,
    item: string,
    quantity: number,
    price: number,
    totalTax: number,
    totalPrice: number,
    notes: string,
}

interface CartData extends mongoose.Document {
    status: string, //ok or cancel
    admin_id: string,
    item: string,
    quantity: number,
    price: number,
    totalTax: number,
    totalPrice: number,
    notes: string, //input cancel reason
}

interface CartInterface extends mongoose.Model<CartData> {
    build(attr: Cart): CartData
}

const cartSchema = new Schema({
    status: { type: String, default: "ok" },
    admin_id: { type: Schema.Types.ObjectId, ref: 'User' },
    item: { type: String },
    quantity: { type: Number, default: 1 },
    price: { type: Number },
    totalTax: { type: Number, select: false },
    totalPrice: { type: Number },
    notes: { type: String },
}, { timestamps: true });

const Cart = mongoose.model<CartData, CartInterface>('Cart', cartSchema)
export { Cart }