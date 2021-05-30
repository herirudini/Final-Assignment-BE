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
        this.listSuplier();
        this.listNames();
        this.createProduct();
        this.listProduct();
        this.searchProduct();
        this.setProductStatus();
        this.purchaseOrder();
        this.deliveryOrder();
    }
    // public createBrand(): void {
    //     this.router.post('/order/edit-order', inventoryController.editOrder);
    // }
    createSuplier() {
        this.router.post('/suplier', authJwt_1.default.inventoryAuth, authJwt_1.default.uniqueDataSuplier, inventory_controller_1.default.createSuplier);
    }
    listSuplier() {
        this.router.get('/suplier', authJwt_1.default.inventoryAuth, inventory_controller_1.default.listSuplier);
    }
    listNames() {
        this.router.get('/list-names', authJwt_1.default.inventoryAuth, inventory_controller_1.default.listNames);
    }
    createProduct() {
        this.router.post('/product', authJwt_1.default.inventoryAuth, authJwt_1.default.uniqueDataProduct, inventory_controller_1.default.createProduct);
    }
    listProduct() {
        this.router.get('/product', authJwt_1.default.inventoryAuth, inventory_controller_1.default.listProduct);
    }
    searchProduct() {
        this.router.get('/product/search', authJwt_1.default.inventoryAuth, inventory_controller_1.default.searchProduct);
    }
    setProductStatus() {
        this.router.patch('/product/status/:product_id', authJwt_1.default.inventoryAuth, inventory_controller_1.default.setProductStatus);
    }
    purchaseOrder() {
        this.router.post('/purchase-order', authJwt_1.default.inventoryAuth, inventory_controller_1.default.purchaseOrder);
    }
    deliveryOrder() {
        this.router.post('/delivery-order', authJwt_1.default.inventoryAuth, inventory_controller_1.default.deliveryOrder);
    }
}
exports.default = new inventoryRouter().router;
