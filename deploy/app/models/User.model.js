"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const validator = require('mongoose-validators');
const userSchema = new mongoose_1.Schema({
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
    logToken: { type: String },
    masterkey: { type: String, select: false }
}, { timestamps: true });
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
