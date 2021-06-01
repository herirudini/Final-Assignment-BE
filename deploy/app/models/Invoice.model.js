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
const invoiceSchema = new mongoose_1.Schema({
    status: { type: String, default: "unpaid" },
    suplier_name: { type: String },
    orders: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Order' }],
    bill: { type: Number },
}, { timestamps: true });
const Invoice = mongoose_1.default.model('Invoice', invoiceSchema);
exports.Invoice = Invoice;
