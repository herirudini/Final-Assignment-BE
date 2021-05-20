import mongoose, { Schema } from 'mongoose';
const validator = require('mongoose-validators')

interface User {
    role: string,
    username: string,
    email: string,
    password: string,
    logIp: any[],
    logToken: string
}

interface UserData extends mongoose.Document {
    role: string,
    username: string,
    email: string,
    password: string,
    logIp: any[],
    logToken: string
}

interface UserInterface extends mongoose.Model<UserData> {
    build(attr: User): UserData
}

const userSchema = new Schema({
    role: { type: String, required: true },
    username: { type: String, required: true },
    email: {
        type: String,
        validate: validator.isEmail(),
        required: true
    },
    password: {
        type: String,
        required: true, select: false
    },
    logIp: [{ type: String }],
    logToken: { type: String }
}, { timestamps: true });

const User = mongoose.model<UserData, UserInterface>('User', userSchema)
export { User }