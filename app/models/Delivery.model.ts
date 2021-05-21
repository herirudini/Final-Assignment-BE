import mongoose, { Schema } from 'mongoose';

interface Delivery {
    order_id: string, 
    arrivedQuantity: number,
}

interface DeliveryData extends mongoose.Document {
    order_id: string,
    arrivedQuantity: number,
}

interface DeliveryInterface extends mongoose.Model<DeliveryData> {
    build(attr: Delivery): DeliveryData
}

const deliverySchema = new Schema({
    order_id: { type: Schema.Types.ObjectId, ref: 'Order' },
    arrivedQuantity: { type: Number, default: 0 },
}, { timestamps: true });

const Delivery = mongoose.model<DeliveryData, DeliveryInterface>('Delivery', deliverySchema)
export { Delivery }