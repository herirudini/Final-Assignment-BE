"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventory_controller_1 = __importDefault(require("../controllers/inventory.controller"));
const authJwt_1 = __importDefault(require("../middlewares/authJwt"));
const uploadFiles = require('../middlewares/multer');
class inventoryRouter {
    constructor() {
        this.router = express_1.Router();
        this.createSuplier();
        this.listSuplier();
        this.getSuplierByName();
        this.listBrandBySuplierName(); // only retrive brand list
        this.listProductAndUomByBrandName(); //only retrive product name and uom name
        this.listAllBrand();
        this.createProduct();
        this.getAllProduct();
        this.searchProduct();
        this.getProductByBrand();
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
    getSuplierByName() {
        this.router.put('/suplier', inventory_controller_1.default.getSuplierByName);
    }
    listBrandBySuplierName() {
        this.router.put('/list-brand', inventory_controller_1.default.listBrandBySuplierName);
    }
    listAllBrand() {
        this.router.get('/listBrand', inventory_controller_1.default.listAllBrand);
    }
    listProductAndUomByBrandName() {
        this.router.put('/list-product-uom', inventory_controller_1.default.listProductAndUomByBrandName);
    }
    createProduct() {
        this.router.post('/product', authJwt_1.default.uniqueDataProduct, inventory_controller_1.default.createProduct);
    }
    getAllProduct() {
        this.router.get('/product', inventory_controller_1.default.getAllProduct);
    }
    getProductByBrand() {
        this.router.put('/product/byBrand', inventory_controller_1.default.getProductByBrand);
    }
    searchProduct() {
        this.router.put('/product/search', inventory_controller_1.default.searchProduct);
    }
    setProductStatus() {
        this.router.patch('/product/status/:product_id', inventory_controller_1.default.setProductStatus);
    }
    editProduct() {
        this.router.patch('/product/edit/:product_id', inventory_controller_1.default.editProduct);
    }
    purchaseOrder() {
        this.router.post('/purchase-order', inventory_controller_1.default.purchaseOrder);
    }
    deliveryOrder() {
        this.router.post('/delivery-order', inventory_controller_1.default.deliveryOrder);
    }
}
exports.default = new inventoryRouter().router;
