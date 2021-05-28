"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_model_1 = require("../models/User.model");
const Suplier_model_1 = require("../models/Suplier.model");
const Product_model_1 = require("../models/Product.model");
const validator = require('validator');
class auth {
    static authentication(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const access_token = req.headers.access_token;
            const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
            try {
                if (!access_token) {
                    console.log("Incorrect Token: Please Login");
                    throw ({ name: 'missing_token' });
                }
                else {
                    jwt.verify(access_token, process.env.TOKEN, (err, decoded) => {
                        if (err) {
                            throw ({ name: 'invalid_token' });
                        }
                        req.user_id = decoded.id;
                    });
                    const author = yield User_model_1.User.findById(req.user_id);
                    const logToken = author.logToken;
                    const logIp = author.logIp;
                    let ipExist = logIp.includes(ip);
                    if (ipExist == false || logToken != access_token) {
                        throw ({ name: 'invalid_token' });
                    }
                    else {
                        console.log("berhasil lewat Authentication");
                        next();
                    }
                }
            }
            catch (err) {
                console.log("masuk catch auth:" + err);
                next(err);
            }
        });
    }
    static uniqueDataUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputEmail = req.body.new_email;
            const inputUsername = req.body.new_username;
            const isValidEmail = validator.isEmail(inputEmail);
            const checkUserByEmail = yield User_model_1.User.countDocuments({ email: inputEmail });
            const checkUserByName = yield User_model_1.User.countDocuments({ username: inputUsername });
            try {
                if (isValidEmail === false) {
                    throw ({ name: 'invalid_email' });
                }
                else if (checkUserByEmail != 0) {
                    throw ({ name: 'unique_email' });
                }
                else if (checkUserByName != 0) {
                    throw ({ name: 'unique_username' });
                }
                else {
                    next();
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
    static uniqueDataSuplier(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputSuplierName = req.body.suplierName.toUpperCase();
            const checkSuplierByName = yield Suplier_model_1.Suplier.countDocuments({ name: inputSuplierName });
            try {
                if (checkSuplierByName != 0) {
                    throw ({ name: 'unique_name' });
                }
                else {
                    next();
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
    static uniqueDataProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputBarcode = req.body.barcode;
            const checkProductByBarcode = yield Product_model_1.Product.countDocuments({ barcode: inputBarcode });
            try {
                if (checkProductByBarcode != 0) {
                    throw ({ name: 'unique_barcode' });
                }
                else {
                    next();
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
    static twoStepAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const getUser = yield User_model_1.User.findById(req.user_id).select('+password');
            try {
                if (!req.body.password) {
                    res.status(402).json({ success: false, message: "Please input password!" });
                }
                else {
                    const match = bcrypt_1.default.compareSync(req.body.password, getUser.password);
                    if (!match) {
                        throw ({ name: 'twostep_auth' });
                    }
                    else {
                        next();
                    }
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
    static resetPasswordAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.user_id;
            const secretToken = req.params.secret_key;
            const getUser = yield User_model_1.User.findById(userId).select('+masterkey');
            try {
                if (!secretToken || !userId) {
                    res.status(402).json({ success: false, message: "Ultra-Terrestrial ERROR" });
                }
                else {
                    const match = bcrypt_1.default.compareSync(secretToken, getUser.masterkey);
                    if (!match) {
                        res.status(402).json({ success: false, message: "Ultra-Terrestrial ERROR !match" });
                    }
                    else {
                        next();
                    }
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
    static ownerAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const author = yield User_model_1.User.findById(req.user_id);
            try {
                if (!author) {
                    throw ({ name: 'not_found' });
                }
                else if (author.role == "owner") {
                    next();
                }
                else {
                    throw ({ name: 'unauthorized' });
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
    static inventoryAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const author = yield User_model_1.User.findById(req.user_id);
            try {
                if (!author) {
                    throw ({ name: 'not_found' });
                }
                else if (author.role == "inventory" || author.role == "owner") {
                    next();
                }
                else {
                    throw ({ name: 'unauthorized' });
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
    static financeAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const author = yield User_model_1.User.findById(req.user_id);
            try {
                if (!author) {
                    throw ({ name: 'not_found' });
                }
                else if (author.role == "finance" || author.role == "owner") {
                    next();
                }
                else {
                    throw ({ name: 'unauthorized' });
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
    static cashierAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const author = yield User_model_1.User.findById(req.user_id);
            try {
                if (!author) {
                    throw ({ name: 'not_found' });
                }
                else if (author.role == "cashier" || author.role == "owner") {
                    next();
                }
                else {
                    throw ({ name: 'unauthorized' });
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
}
exports.default = auth;
