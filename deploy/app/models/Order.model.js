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
const orderSchema = new mongoose_1.Schema({
    status: { type: String, default: "on-process" },
    suplier_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Suplier', required: true },
    product_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    brand_name: { type: String, required: true },
    uom: { type: String, required: true },
    buyPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    quantity: { type: Number, required: true },
    subTotal: { type: Number },
    arrived: { type: Number, default: 0 },
    isAfterTax: { type: String, default: "yes" },
}, { timestamps: true });
const Order = mongoose_1.default.model('Order', orderSchema);
exports.Order = Order;
