import mongoose, { Schema } from 'mongoose';

interface User {
    role: string,
    username: string,
    email: string,
    password: string,
    logIp: any[],
    logToken: string,
    masterkey: string
}

interface UserData extends mongoose.Document {
    role: string,
    username: string,
    email: string,
    password: string,
    logIp: any[],
    logToken: string,
    masterkey: string
}

interface UserInterface extends mongoose.Model<UserData> {
    build(attr: User): UserData
}

const userSchema = new Schema({
    role: { type: String, required: true },
    username: { type: String, required: true },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true, select: false
    },
    logIp: [{ type: String }],
    logToken: { type: String },
    masterkey: { type: String, select: false }
}, { timestamps: true });

const User = mongoose.model<UserData, UserInterface>('User', userSchema)
export { User }