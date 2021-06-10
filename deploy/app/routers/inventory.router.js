"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventory_controller_1 = __importDefault(require("../controllers/inventory.controller"));
const authJwt_1 = __importDefault(require("../middlewares/authJwt"));
const storage_1 = __importDefault(require("../middlewares/storage"));
class inventoryRouter {
    constructor() {
        this.router = express_1.Router();
        this.createSuplier();
        this.listSuplier();
        this.listBrand();
        this.listProductAndUom();
        this.createProduct();
        this.getAllProduct();
        this.searchProduct();
        this.setProductStatus();
        this.editProduct();
        this.purchaseOrder();
        this.deliveryOrder();
    }
    createSuplier() {
        this.router.post('/suplier', authJwt_1.default.uniqueDataSuplier, inventory_controller_1.default.createSuplier);
    }
    listSuplier() {
        this.router.get('/suplier', inventory_controller_1.default.listSuplier);
    }
    listBrand() {
        this.router.get('/list-brand', inventory_controller_1.default.listBrand);
    }
    listProductAndUom() {
        this.router.get('/list-product-uom', inventory_controller_1.default.listProductAndUom);
    }
    createProduct() {
        this.router.post('/product', authJwt_1.default.uniqueDataProduct, storage_1.default, inventory_controller_1.default.createProduct);
    }
    getAllProduct() {
        this.router.get('/product', inventory_controller_1.default.getAllProduct);
    }
    searchProduct() {
        this.router.get('/product/search', inventory_controller_1.default.searchProduct);
    }
    setProductStatus() {
        this.router.patch('/product/status/:product_id', inventory_controller_1.default.setProductStatus, inventory_controller_1.default.getAllProduct);
    }
    editProduct() {
        this.router.patch('/product/edit/:product_id', inventory_controller_1.default.editProduct, inventory_controller_1.default.getAllProduct);
    }
    purchaseOrder() {
        this.router.post('/purchase-order', inventory_controller_1.default.purchaseOrder);
    }
    deliveryOrder() {
        this.router.post('/delivery-order', inventory_controller_1.default.deliveryOrder);
    }
}
exports.default = new inventoryRouter().router;
