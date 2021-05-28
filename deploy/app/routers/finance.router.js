"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const finance_controller_1 = __importDefault(require("../controllers/finance.controller"));
class financeRouter {
    constructor() {
        this.router = express_1.Router();
        this.getAllInvoice();
        this.updateInvoiceStatus();
        this.getOutcome();
        this.getIncome();
    }
    getAllInvoice() {
        this.router.get('/invoice', finance_controller_1.default.getAllInvoice);
    }
    updateInvoiceStatus() {
        this.router.patch('/invoice/:invoice_id', finance_controller_1.default.updateInvoiceStatus);
    }
    getOutcome() {
        this.router.get('/outcome', finance_controller_1.default.getOutcome);
    }
    getIncome() {
        this.router.get('/income', finance_controller_1.default.getIncome);
    }
}
exports.default = new financeRouter().router;
