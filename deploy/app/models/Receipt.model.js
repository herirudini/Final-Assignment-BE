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
const receiptSchema = new mongoose_1.Schema({
    items: [{ type: Object }],
    totalTax: { type: Number },
    subtotal: { type: Number },
    date: { type: Date, default: Date.now },
});
const Receipt = mongoose_1.default.model('Receipt', receiptSchema);
exports.Receipt = Receipt;
