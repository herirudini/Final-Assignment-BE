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
        // this.getInvoiceBySuplier()
        this.getInvoiceById();
        this.updateInvoiceStatus();
        this.getOutcome();
        this.getIncome();
    }
    getAllInvoice() {
        this.router.get('/invoice', finance_controller_1.default.getAllInvoice);
    }
    // public getInvoiceBySuplier(): void {
    //     this.router.get('/invoice/suplier', financeController.getInvoiceBySuplier);
    // }
    getInvoiceById() {
        this.router.get('/invoice/:invoice_id', finance_controller_1.default.getInvoiceById);
    }
    updateInvoiceStatus() {
        this.router.patch('/invoice/:invoice_id', finance_controller_1.default.updateInvoiceStatus);
    }
    getOutcome() {
        this.router.put('/outcome', finance_controller_1.default.getOutcome);
    }
    getIncome() {
        this.router.put('/income', finance_controller_1.default.getIncome);
    }
}
exports.default = new financeRouter().router;
