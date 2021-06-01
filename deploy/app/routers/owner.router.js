"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authJwt_1 = __importDefault(require("../middlewares/authJwt"));
const owner_controller_1 = __importDefault(require("../controllers/owner.controller"));
class ownerRouter {
    constructor() {
        this.router = express_1.Router();
        this.createUser();
        this.listUser();
        this.cashflow();
        this.getTopProduct();
    }
    createUser() {
        this.router.post('/create-user', authJwt_1.default.uniqueDataUser, owner_controller_1.default.createUser);
    }
    listUser() {
        this.router.get('/list-user', authJwt_1.default.uniqueDataUser, owner_controller_1.default.listUser);
    }
    cashflow() {
        this.router.get('/cashflow', owner_controller_1.default.cashflow);
    }
    getTopProduct() {
        this.router.get('/top-product', owner_controller_1.default.getTopProduct);
    }
}
exports.default = new ownerRouter().router;
