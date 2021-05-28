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
const deliverySchema = new mongoose_1.Schema({
    order_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Order' },
    arrivedQuantity: { type: Number, default: 0 },
}, { timestamps: true });
const Delivery = mongoose_1.default.model('Delivery', deliverySchema);
exports.Delivery = Delivery;
