"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authJwt_1 = __importDefault(require("../middlewares/authJwt"));
const inventory_router_1 = __importDefault(require("./inventory.router"));
const finance_router_1 = __importDefault(require("./finance.router"));
const cashier_router_1 = __importDefault(require("./cashier.router"));
const owner_controller_1 = __importDefault(require("../controllers/owner.controller"));
class ownerRouter {
    constructor() {
        this.router = express_1.Router();
        this.createUser();
        this.listUser();
        this.inventory();
        this.finance();
        this.cashier();
        this.cashflow();
        this.getTopProduct();
    }
    createUser() {
        this.router.post('/user', authJwt_1.default.ownerAuth, authJwt_1.default.uniqueDataUser, owner_controller_1.default.createUser);
    }
    listUser() {
        this.router.get('/user', authJwt_1.default.ownerAuth, authJwt_1.default.uniqueDataUser, owner_controller_1.default.listUser);
    }
    inventory() {
        this.router.use(inventory_router_1.default);
    }
    finance() {
        this.router.use(finance_router_1.default);
    }
    cashier() {
        this.router.use(cashier_router_1.default);
    }
    cashflow() {
        this.router.get('/cashflow', authJwt_1.default.ownerAuth, owner_controller_1.default.cashflow);
    }
    getTopProduct() {
        this.router.get('/top-product', authJwt_1.default.ownerAuth, owner_controller_1.default.getTopProduct);
    }
}
exports.default = new ownerRouter().router;
