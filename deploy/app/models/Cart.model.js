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
const cartSchema = new mongoose_1.Schema({
    status: { type: String, default: "on-process" },
    admin_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    product_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' },
    brand_name: { type: String },
    product_name: { type: String },
    uom: { type: String },
    quantity: { type: Number, default: 1 },
    price: { type: Number },
    tax: { type: Number },
    totalPrice: { type: Number },
    notes: { type: String, select: false },
    date: { type: Date, default: Date.now },
});
const Cart = mongoose_1.default.model('Cart', cartSchema);
exports.Cart = Cart;
