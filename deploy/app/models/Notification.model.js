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
const notificationSchema = new mongoose_1.Schema({
    status: { type: String, default: "unread" },
    title: { type: String },
    message: { type: String },
}, { timestamps: true });
const Notification = mongoose_1.default.model('Notification', notificationSchema);
exports.Notification = Notification;
