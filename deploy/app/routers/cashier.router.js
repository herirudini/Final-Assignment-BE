"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cashier_controller_1 = __importDefault(require("../controllers/cashier.controller"));
const authJwt_1 = __importDefault(require("../middlewares/authJwt"));
class cashierRouter {
    constructor() {
        this.router = express_1.Router();
        this.searchProduct();
        this.addToCart();
        this.addToCartManual();
        this.listCart();
        this.cancelItem();
        this.checkOut();
        // this.report() //print invoice" yang akan dilaporkan kedalam format xls
    }
    searchProduct() {
        this.router.get('/product', authJwt_1.default.cashierAuth, cashier_controller_1.default.searchProduct);
    }
    addToCart() {
        this.router.put('/product', authJwt_1.default.cashierAuth, cashier_controller_1.default.addToCart);
    }
    addToCartManual() {
        this.router.put('/product/:product_id', authJwt_1.default.cashierAuth, cashier_controller_1.default.addToCartManual);
    }
    listCart() {
        this.router.get('/cart', authJwt_1.default.cashierAuth, cashier_controller_1.default.listCart);
    }
    cancelItem() {
        this.router.patch('/cart/:cart_id', authJwt_1.default.cashierAuth, cashier_controller_1.default.cancelItem, cashier_controller_1.default.listCart);
    }
    checkOut() {
        this.router.post('/checkout', authJwt_1.default.cashierAuth, cashier_controller_1.default.checkOut, cashier_controller_1.default.listCart);
    }
}
exports.default = new cashierRouter().router;
