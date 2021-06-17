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
const nodemailer = require('nodemailer');
class userController {
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_model_1.User.findOne({ email: req.body.email }).select('+password');
            const passwordIsValid = bcrypt_1.default.compareSync(req.body.password, user.password);
            const token = jwt.sign({ id: user.id }, process.env.TOKEN);
            const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
            const logIp = user.logIp;
            let ipExist = logIp.includes(ip);
            let updateCredentials;
            try {
                if (!passwordIsValid) {
                    throw ({ name: 'not_verified' });
                }
                else if (!ipExist) { //true email and password
                    updateCredentials = yield User_model_1.User.findOneAndUpdate({ email: req.body.email }, { $push: { logIp: ip } }, { new: true });
                    res.status(202).json({ success: true, message: "success login", data: user, token });
                }
                else {
                    res.status(202).json({ success: true, message: "success login", data: user, token });
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
            let updateCredentials;
            try {
                console.log("berhasil masuk logout controller");
                updateCredentials = yield User_model_1.User.findByIdAndUpdate(req.user_id, { $pull: { logIp: ip } }, { new: true });
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
    }
    static changeEmailOrUsername(req, res, next) {
        const { new_username, new_email } = req.body;
        const newData = { username: new_username, email: new_email };
        for (const key in newData) {
            if (!newData[key])
                delete newData[key];
        }
        User_model_1.User.findByIdAndUpdate(req.user_id, newData, { new: true })
            .then((result) => {
            res.status(200).json({ success: true, message: "Success change user data", data: result });
            next();
        })
            .catch((err) => {
            res.status(422).json({ success: false, message: err });
        });
    }
    static changePassword(req, res, next) {
        User_model_1.User.findByIdAndUpdate(req.user_id, { password: bcrypt_1.default.hashSync(req.body.new_password, 8) }, { new: true }).select('+password')
            .then((result) => {
            res.status(200).json({ success: true, message: "Success change user password", data: result });
            next();
        })
            .catch((err) => {
            console.log(err);
            next(err);
        });
    }
    static forgetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputEmail = req.body.email;
            const inputOriginUrl = req.body.originUrl;
            const getUser = yield User_model_1.User.findOne({ email: inputEmail });
            const getUserName = getUser === null || getUser === void 0 ? void 0 : getUser.username;
            const getUserId = getUser === null || getUser === void 0 ? void 0 : getUser.id;
            const superkey = jwt.sign({ pesan: inputEmail }, process.env.TOKEN);
            const masterkey = bcrypt_1.default.hashSync(superkey, 8);
            const usermailer = process.env.USERMAILER;
            const passmailer = process.env.PASSMAILER;
            const hostmailer = process.env.HOSTMAILER;
            const portmailer = process.env.PORTMAILER;
            let linkChangePassword;
            let mailOptions;
            let sendEmailToUser;
            let updateUser;
            try {
                linkChangePassword = inputOriginUrl + `/${getUserId}/${superkey}`;
                const transporter = nodemailer.createTransport({
                    service: hostmailer,
                    // port: parseInt(portmailer),
                    auth: {
                        user: usermailer,
                        pass: passmailer
                    }
                });
                mailOptions = {
                    from: `"Acong Kelontong" <${usermailer}>`,
                    to: inputEmail,
                    subject: "Reset Password",
                    text: `Dear ${getUserName}, please click the link below to reset your password
                ${linkChangePassword}
                `
                };
                sendEmailToUser = transporter.sendMail(mailOptions, (err, info) => { (err) ? console.log(err) : console.log("Email sent: " + info.responsive); });
                updateUser = yield User_model_1.User.findOneAndUpdate({ email: inputEmail }, { masterkey: masterkey, }, { new: true });
            }
            catch (err) {
                res.status(422).json({ success: false, message: "forgotPassword update user failed!", data: err });
            }
            finally {
                res.status(201).json({ success: true, message: "chek your email" });
            }
        });
    }
    static resetPassword(req, res, next) {
        User_model_1.User.findByIdAndUpdate(req.params.user_id, { password: bcrypt_1.default.hashSync(req.body.new_password, 8) }, { new: true }).select('+password')
            .then((result) => {
            res.status(200).json({ success: true, message: "Password changed! Please login" });
        })
            .catch((err) => {
            console.log(err);
            next(err);
        });
    }
}
exports.default = userController;
