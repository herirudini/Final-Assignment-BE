import mongoose, { Schema } from 'mongoose';

interface Notification {
    status: string,
    title: string,
    message: string,
}

interface NotificationData extends mongoose.Document {
    status: string, //unread, read
    title: string, //stock
    message: string,
}

interface NotificationInterface extends mongoose.Model<NotificationData> {
    build(attr: Notification): NotificationData
}

const notificationSchema = new Schema({
    status: { type: String, default: "unread" },
    title: { type: String },
    message: { type: String },
}, { timestamps: true });

const Notification = mongoose.model<NotificationData, NotificationInterface>('Notification', notificationSchema)
export { Notification }