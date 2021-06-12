"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cashier_controller_1 = __importDefault(require("../controllers/cashier.controller"));
const inventory_controller_1 = __importDefault(require("../controllers/inventory.controller"));
class cashierRouter {
    constructor() {
        this.router = express_1.Router();
        this.addToCart();
        this.searchProduct();
        this.addToCartManual();
        this.listCart();
        this.cancelItem();
        this.checkOut();
        // this.listReceipt()
    }
    getAllProduct() {
        this.router.get('/product', inventory_controller_1.default.getAllProduct);
    }
    addToCart() {
        this.router.post('/product', cashier_controller_1.default.addToCart);
    }
    searchProduct() {
        this.router.put('/product', cashier_controller_1.default.searchProduct);
    }
    addToCartManual() {
        this.router.put('/product/:product_id', cashier_controller_1.default.addToCartManual);
    }
    listCart() {
        this.router.get('/cart', cashier_controller_1.default.listCart);
    }
    cancelItem() {
        this.router.put('/cart/:cart_id', cashier_controller_1.default.cancelItem, cashier_controller_1.default.listCart);
    }
    checkOut() {
        this.router.post('/checkout', cashier_controller_1.default.checkOut, cashier_controller_1.default.listCart);
    }
    listReceipt() {
        this.router.get('/receipt', cashier_controller_1.default.listReceipt);
    }
}
exports.default = new cashierRouter().router;
