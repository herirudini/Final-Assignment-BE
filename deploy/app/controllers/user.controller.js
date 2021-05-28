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
// const nodemailer: any = require('nodemailer');
// const envEmail: any = process.env.EMAIL as string;
// const envEmailPass: any = process.env.EMAIL_PASS as string;
// const transporter: any = nodemailer.createTransport({ service: 'gmail', auth: { user: envEmail, pass: envEmailPass } })
class userController {
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_model_1.User.findOne({ email: req.body.email }).select('+password');
            const passwordIsValid = bcrypt_1.default.compareSync(req.body.password, user.password);
            const token = jwt.sign({ id: user.id }, process.env.TOKEN);
            const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
            const logIp = user.logIp;
            let ipExist = logIp.includes(ip);
            let signCredentials;
            let credentialsData;
            ipExist ? credentialsData = { logToken: token } : credentialsData = { $push: { logIp: ip }, logToken: token };
            try {
                // console.log(typeof(logIp))
                console.log("login Controller Ip exist?: " + ipExist);
                if (!user) { //wrong email
                    throw ({ name: 'not_verified' });
                }
                else if (passwordIsValid) { //true email and password
                    signCredentials = yield User_model_1.User.findOneAndUpdate({ email: req.body.email }, credentialsData, { new: true });
                    res.status(202).json({ success: true, message: "success login", data: signCredentials, AccessToken: token });
                }
                else { //true email, wrong password
                    throw ({ name: 'not_verified' });
                }
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
    static logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
            let signCredentials;
            try {
                console.log("berhasil masuk logout controller");
                signCredentials = yield User_model_1.User.findByIdAndUpdate(req.user_id, { $pull: { logIp: ip }, logToken: "" }, { new: true });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
            finally {
                res.status(401).json({ success: true, message: "Success logout" });
            }
        });
    }
    static myDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            User_model_1.User.findById(req.user_id)
                .then((result) => {
                if (result == null) {
                    throw ({ name: 'not_found' });
                }
                res.status(200).json({ success: true, message: "User data", data: result });
            })
                .catch((err) => {
                next(err);
            });
        });
    }
    static changeEmailOrUsername(req, res, next) {
        const { new_username, new_email } = req.body;
        const newData = { phone: new_username, email: new_email };
        for (const key in newData) {
            if (!newData[key])
                delete newData[key];
        }
        User_model_1.User.findByIdAndUpdate(req.user_id, newData, { new: true })
            .then((result) => {
            res.status(200).json({ success: true, message: "Email/Phone changed! You're logged out automatically ", data: result });
            next();
        })
            .catch((err) => {
            res.status(422).json({ success: false, message: err });
        });
    }
    static changePassword(req, res, next) {
        User_model_1.User.findByIdAndUpdate(req.user_id, { password: bcrypt_1.default.hashSync(req.body.new_password, 8) }, { new: true }).select('+password')
            .then((result) => {
            res.status(200).json({ success: true, message: "Password changed! You're logged out automatically" });
            next();
        })
            .catch((err) => {
            console.log(err);
            next(err);
        });
    }
    static forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputEmail = req.body.email;
            const superkey = jwt.sign({ pesan: inputEmail }, process.env.TOKEN);
            const masterkey = bcrypt_1.default.hashSync(superkey, 8);
            let linkChangePassword;
            let updateUser;
            try {
                updateUser = yield User_model_1.User.findOneAndUpdate({ email: inputEmail }, { masterkey: masterkey, }, { new: true });
            }
            catch (err) {
                res.status(422).json({ success: false, message: "forgotPassword update user failed!", data: err });
            }
            finally {
                linkChangePassword = `/${updateUser.id}/${superkey}`;
                res.status(201).json({ success: true, message: "chek your email", data: updateUser, linkChangePassword });
            }
        });
    }
    static resetPassword(req, res, next) {
        User_model_1.User.findByIdAndUpdate(req.params.user_id, { password: bcrypt_1.default.hashSync(req.body.new_password, 8) }, { new: true }).select('+password')
            .then((result) => {
            res.status(200).json({ success: true, message: "Password changed! You're logged out automatically" });
            next();
        })
            .catch((err) => {
            console.log(err);
            next(err);
        });
    }
}
exports.default = userController;
