import mongoose, { Schema } from 'mongoose';
const validator: any = require('mongoose-validators');

interface User {
    role: string,
    username: string,
    email: string,
    password: string,
    logIp: any[],
    masterkey: string
}

interface UserData extends mongoose.Document {
    role: string,
    username: string,
    email: string,
    password: string,
    logIp: any[],
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
        required: true,
        validate: validator.isEmail()
    },
    password: {
        type: String,
        select: false,
        default: null
    },
    logIp: [{ type: String }],
    masterkey: { type: String, select: false }
}, { timestamps: true });

const User = mongoose.model<UserData, UserInterface>('User', userSchema)
export { User }