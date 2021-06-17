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
const productSchema = new mongoose_1.Schema({
    status: { type: String, default: "inactive" },
    suplier_name: { type: String, required: true },
    brand_name: { type: String, required: true },
    product_name: { type: String, required: true },
    image: { type: Buffer, required: true },
    uom: { type: String, required: true },
    stock: { type: Number, default: 0 },
    buyPrice: { type: Number },
    sellPrice: { type: Number, required: true },
    isAfterTax: { type: String },
    barcode: { type: String, required: true }
}, { timestamps: true });
productSchema.index({ product_name: 'text', brand_name: 'text', uom: 'text', suplier_name: 'text' }, { weights: { product_name: 5, brand_name: 4, uom: 3, suplier_name: 1 } });
const Product = mongoose_1.default.model('Product', productSchema);
exports.Product = Product;
