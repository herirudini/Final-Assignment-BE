"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import customerRouter from './customer.routes'
// import addressRouter from './address.routes'
// import messageRouter from './message.routes'
// import orderRouter from './order.routes'
// import invoiceRouter from './invoice.routes'
// import productController from '../controllers/product.controller'
// import customerController from '../controllers/customer.controller'
const errorHandler_1 = __importDefault(require("../middlewares/errorHandler"));
const authJwt_1 = __importDefault(require("../middlewares/authJwt"));
class Routes {
    constructor() {
        this.router = express_1.Router();
        this.login();
        this.authentication();
        this.owner();
        this.inventory();
        this.accounting();
        this.cashier();
        this.logout();
        this.errorHandler();
    }
    login() {
        // this.router.put('/login', userController.login)
    }
    authentication() {
        this.router.use(authJwt_1.default.authentication);
    }
    owner() {
        // this.router.use(auth.ownerAuth, ownerRouter)
    }
    inventory() {
        // this.router.use(auth.inventoryAuth, inventoryRouter)
    }
    accounting() {
        // this.router.use(auth.accountingAuth, accountingRouter)
    }
    cashier() {
        // this.router.use(auth.cashierAuth, cashierRouter)
    }
    logout() {
        // this.router.patch('/logout', userController.logout)
    }
    errorHandler() {
        this.router.use(errorHandler_1.default);
    }
}
exports.default = new Routes().router;
