"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Cart_model_1 = require("../models/Cart.model");
// import { Receipt } from '../models/Receipt.model'
const Invoice_model_1 = require("../models/Invoice.model");
class financeController {
    static getAllInvoice(req, res, next) {
        Invoice_model_1.Invoice.find().populate('orders')
            .then((result) => {
            res.status(200).json({ success: true, message: "All Invoices: ", data: result });
        })
            .catch((err) => {
            next(err);
        });
    }
    static getInvoiceBySuplier(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputSuplierName = req.body.suplier_name.toUpperCase();
            let listInvoice;
            try {
                listInvoice = yield Invoice_model_1.Invoice.find({ suplier_name: inputSuplierName }).populate('orders');
                res.status(200).json({ success: true, message: "All Invoices: ", data: listInvoice });
            }
            catch (err) {
                next(err);
            }
        });
    }
    static getInvoiceById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const getInvoiceId = req.params.invoice_id;
            Invoice_model_1.Invoice.findById(getInvoiceId).populate('orders')
                .then((result) => {
                res.status(200).json({ success: true, message: "Invoices details: ", data: result });
            })
                .catch((err) => {
                next(err);
            });
        });
    }
    static updateInvoiceStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const getId = req.params.invoice_id;
            const checkInvoice = yield Invoice_model_1.Invoice.countDocuments({ _id: getId, status: "unpaid" });
            let updateStatus;
            try {
                if (checkInvoice == 0) {
                    throw ({ name: "not_found" });
                }
                else {
                    updateStatus = yield Invoice_model_1.Invoice.findOneAndUpdate({ _id: getId, status: "unpaid" }, { status: "paid" }, { new: true });
                }
                ;
                res.status(200).json({ success: true, message: "Invoice Updated!", data: updateStatus });
            }
            catch (err) {
                next(err);
            }
        });
    }
    static getOutcome(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputDateFrom = req.body.date_from;
            const inputDateTo = req.body.date_to;
            const dateFrom = inputDateFrom + "T00:00:00.0000";
            const dateTo = inputDateTo + "T23:59:59.0000";
            const dateRange = { $gte: dateFrom, $lte: dateTo };
            let getInvoices;
            try {
                getInvoices = yield Invoice_model_1.Invoice.find({ status: "paid", updatedAt: dateRange });
            }
            catch (err) {
                next(err);
            }
            finally {
                res.status(200).json({ success: true, message: "paid invoices:", data: getInvoices });
            }
        });
    }
    static getIncome(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputDateFrom = req.body.date_from;
            const inputDateTo = req.body.date_to;
            const dateFrom = inputDateFrom + "T00:00:00.0000";
            const dateTo = inputDateTo + "T23:59:59.0000";
            const dateRange = { $gte: dateFrom, $lte: dateTo };
            let getSoldProduct;
            try {
                console.log("data range", dateRange);
                getSoldProduct = yield Cart_model_1.Cart.find({ status: "sold", date: dateRange });
            }
            catch (err) {
                next(err);
            }
            finally {
                res.status(200).json({ success: true, message: "sold products:", data: getSoldProduct });
            }
        });
    }
}
exports.default = financeController;
