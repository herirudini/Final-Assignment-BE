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
const suplierSchema = new mongoose_1.Schema({
    suplier_name: { type: String, required: true },
    contact: {
        type: String,
        required: true
    },
    address: { type: String },
    brands: [{ type: String }],
}, { timestamps: true });
const Suplier = mongoose_1.default.model('Suplier', suplierSchema);
exports.Suplier = Suplier;
