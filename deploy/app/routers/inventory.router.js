"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventory_controller_1 = __importDefault(require("../controllers/inventory.controller"));
const authJwt_1 = __importDefault(require("../middlewares/authJwt"));
class inventoryRouter {
    constructor() {
        this.router = express_1.Router();
        // this.editOrder()
        this.createSuplier();
        this.createProduct();
        this.purchaseOrder();
        this.deliveryOrder();
        this.searchProduct();
        this.setProductStatus();
    }
    // public createBrand(): void {
    //     this.router.post('/order/edit-order', inventoryController.editOrder);
    // }
    createSuplier() {
        this.router.post('/suplier', authJwt_1.default.inventoryAuth, authJwt_1.default.uniqueDataSuplier, inventory_controller_1.default.createSuplier);
    }
    createProduct() {
        this.router.post('/product', authJwt_1.default.inventoryAuth, authJwt_1.default.uniqueDataProduct, inventory_controller_1.default.createProduct);
    }
    purchaseOrder() {
        this.router.post('/purchase-order', authJwt_1.default.inventoryAuth, inventory_controller_1.default.purchaseOrder);
    }
    searchProduct() {
        this.router.get('/product', authJwt_1.default.inventoryAuth, inventory_controller_1.default.searchProduct);
    }
    setProductStatus() {
        this.router.patch('/product/:product_id', authJwt_1.default.inventoryAuth, inventory_controller_1.default.setProductStatus);
    }
    deliveryOrder() {
        this.router.post('/delivery-order', authJwt_1.default.inventoryAuth, inventory_controller_1.default.deliveryOrder);
    }
}
exports.default = new inventoryRouter().router;
