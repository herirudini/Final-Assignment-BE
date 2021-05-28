"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const owner_router_1 = __importDefault(require("./owner.router"));
const inventory_router_1 = __importDefault(require("./inventory.router"));
const finance_router_1 = __importDefault(require("./finance.router"));
const cashier_router_1 = __importDefault(require("./cashier.router"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const errorHandler_1 = __importDefault(require("../middlewares/errorHandler"));
const authJwt_1 = __importDefault(require("../middlewares/authJwt"));
const owner_controller_1 = __importDefault(require("../controllers/owner.controller"));
class Routes {
    constructor() {
        this.router = express_1.Router();
        this.developer();
        this.login();
        this.forgotPassword();
        this.resetPassword();
        this.authentication();
        this.owner();
        this.inventory();
        this.finance();
        this.cashier();
        this.accountDetails();
        this.changeEmailOrPhone();
        this.changePassword();
        this.logout();
        this.errorHandler();
    }
    developer() {
        this.router.post('/create-acong', owner_controller_1.default.createAcong);
    }
    login() {
        this.router.put('/login', user_controller_1.default.login);
    }
    forgotPassword() {
        this.router.put('/login/forgot-password', user_controller_1.default.forgotPassword);
    }
    resetPassword() {
        this.router.patch('/login/reset-password/:user_id/:superkey', authJwt_1.default.resetPasswordAuth, user_controller_1.default.resetPassword);
    }
    authentication() {
        this.router.use(authJwt_1.default.authentication);
    }
    owner() {
        this.router.use(authJwt_1.default.ownerAuth, owner_router_1.default);
    }
    inventory() {
        this.router.use(authJwt_1.default.inventoryAuth, inventory_router_1.default);
    }
    finance() {
        this.router.use(authJwt_1.default.financeAuth, finance_router_1.default);
    }
    cashier() {
        this.router.use(authJwt_1.default.cashierAuth, cashier_router_1.default);
    }
    accountDetails() {
        this.router.get('/user', user_controller_1.default.myDetails);
    }
    changeEmailOrPhone() {
        this.router.patch('/user/change-email-username', authJwt_1.default.twoStepAuth, authJwt_1.default.uniqueDataUser, user_controller_1.default.changeEmailOrUsername, user_controller_1.default.logout);
    }
    changePassword() {
        this.router.patch('/user/change-password', authJwt_1.default.twoStepAuth, user_controller_1.default.changePassword, user_controller_1.default.logout);
    }
    logout() {
        this.router.patch('/logout', user_controller_1.default.logout);
    }
    errorHandler() {
        this.router.use(errorHandler_1.default);
    }
}
exports.default = new Routes().router;
