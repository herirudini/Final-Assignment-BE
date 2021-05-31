"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const finance_controller_1 = __importDefault(require("../controllers/finance.controller"));
const authJwt_1 = __importDefault(require("../middlewares/authJwt"));
class financeRouter {
    constructor() {
        this.router = express_1.Router();
        this.getAllInvoice();
        this.updateInvoiceStatus();
        this.getOutcome();
        this.getIncome();
    }
    getAllInvoice() {
        this.router.get('/invoice', authJwt_1.default.financeAuth, finance_controller_1.default.getAllInvoice);
    }
    getInvoiceBySuplier() {
        this.router.get('/invoice/suplier', authJwt_1.default.financeAuth, finance_controller_1.default.getInvoiceBySuplier);
    }
    updateInvoiceStatus() {
        this.router.patch('/invoice/status/:invoice_id', authJwt_1.default.financeAuth, finance_controller_1.default.updateInvoiceStatus);
    }
    getOutcome() {
        this.router.get('/outcome', authJwt_1.default.financeAuth, finance_controller_1.default.getOutcome);
    }
    getIncome() {
        this.router.get('/income', authJwt_1.default.financeAuth, finance_controller_1.default.getIncome);
    }
}
exports.default = new financeRouter().router;
