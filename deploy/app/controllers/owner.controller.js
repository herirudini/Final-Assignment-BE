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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_model_1 = require("../models/User.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const Cart_model_1 = require("../models/Cart.model");
const Invoice_model_1 = require("../models/Invoice.model");
class acongController {
    static createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = req.body.role;
            const username = req.body.new_username;
            const email = req.body.new_email;
            const superkey = jwt.sign({ pesan: email }, process.env.TOKEN);
            const masterkey = bcrypt_1.default.hashSync(superkey, 8);
            let createUser;
            let mailOptions;
            let sendEmailToUser;
            let linkChangePassword;
            try {
                if (role == "inventory" || role == "finance" || role == "cashier") {
                    createUser = yield User_model_1.User.create({
                        role: role,
                        username: username,
                        email: email,
                        masterkey: masterkey,
                    });
                    linkChangePassword = `/${createUser.id}/${superkey}`;
                    // mailOptions = { from: envEmail, to: email, subject: 'Create Account', text: `https://localhost:3000/login/masterkey/${createUser.id}/${superkey}` };
                }
                else {
                    res.status(422).json({ success: false, message: "create user failed! please choose a valid role: inventory/finance/cashier" });
                }
            }
            catch (err) {
                res.status(422).json({ success: false, message: "create user failed!", data: err });
            }
            finally {
                // sendEmailToUser = transporter.sendMail(mailOptions, (err: any, info: any) => { (err) ? console.log(err) : console.log("Email sent: " + info.responsive) })
                res.status(201).json({ success: true, message: "create user success", data: createUser, linkChangePassword });
            }
        });
    }
    static createAcong(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = req.body.role;
            const username = req.body.new_username;
            const email = req.body.new_email;
            const password = bcrypt_1.default.hashSync("1234", 8);
            const superkey = jwt.sign({ pesan: email }, process.env.TOKEN);
            const masterkey = bcrypt_1.default.hashSync(superkey, 8);
            let createUser;
            try {
                console.log("password acong:" + password);
                createUser = yield User_model_1.User.create({
                    role: role,
                    username: username,
                    email: email,
                    password: password,
                    masterkey: masterkey,
                });
            }
            catch (err) {
                res.status(422).json({ success: false, message: "create user failed!", data: err });
            }
            finally {
                res.status(201).json({ success: true, message: "create user success", data: createUser });
            }
        });
    }
    static getTopProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputDateFrom = req.body.date_from;
            const inputDateTo = req.body.date_to;
            const dateRange = { $gte: inputDateFrom, $lte: inputDateTo };
            let getTopProduct;
            try {
                getTopProduct = yield Cart_model_1.Cart.aggregate([
                    { $match: { status: "sold", date: dateRange } },
                    { $group: { _id: '$product_id', total: { $sum: '$quantity' } } },
                    { $sort: { total: -1 } }
                ]);
            }
            catch (err) {
                next(err);
            }
            finally {
                res.status(200).json({ success: true, message: "Top Products:", data: getTopProduct });
            }
        });
    }
    static cashflow(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputDateFrom = req.body.date_from;
            const inputDateTo = req.body.date_to;
            const dateRange = { $gte: inputDateFrom, $lte: inputDateTo };
            let getSoldProduct;
            let getInvoices;
            try {
                getSoldProduct = Cart_model_1.Cart.find({ status: "sold", date: dateRange });
                getInvoices = yield Invoice_model_1.Invoice.find({ status: "paid", updatedAt: dateRange });
            }
            catch (err) {
                next(err);
            }
            finally {
                res.status(200).json({ success: true, message: "Cashflow:", data: getInvoices, getSoldProduct });
            }
        });
    }
}
exports.default = acongController;
