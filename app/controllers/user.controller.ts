import { User } from '../models/User.model';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
const nodemailer: any = require('nodemailer');

class userController {

    static async login(req: Request, res: Response, next: NextFunction) {
        const user: any = await User.findOne({ email: (<any>req).body.email }).select('+password');
        const passwordIsValid: any = bcrypt.compareSync((<any>req).body.password, user.password);
        const token: string = jwt.sign({ id: user.id }, process.env.TOKEN as string)
        const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        const logIp = user.logIp;
        let ipExist = logIp.includes(ip)
        let signCredentials: any;

        try {
            // console.log(typeof(logIp))
            console.log("login Controller Ip exist?: " + ipExist)
            if (!user) { //wrong email
                throw ({ name: 'not_verified' })
            } else if (passwordIsValid && ipExist == true) { //true email and password
                signCredentials = await User.findOneAndUpdate({ email: req.body.email }, { $push: { logIp: ip } }, { new: true });
                res.status(202).json({ success: true, message: "success login", data: signCredentials, token })
            } else if (passwordIsValid && ipExist == false) {
                res.status(202).json({ success: true, message: "success login", data: signCredentials, token })
            } else { //true email, wrong password
                throw ({ name: 'not_verified' })
            }
        }
        catch (err) {
            console.log(err);
            next(err)
        }
    }
    static async logout(req: Request, res: Response, next: NextFunction) {
        const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        let signCredentials: any;
        try {
            console.log("berhasil masuk logout controller")
            signCredentials = await User.findByIdAndUpdate((<any>req).user_id, { $pull: { logIp: ip }, logToken: "" }, { new: true });
        }
        catch (err) {
            console.log(err)
            next(err)
        }
        finally {
            res.status(401).json({ success: true, message: "Success logout" })
        }
    }
    static myDetails(req: Request, res: Response, next: NextFunction) {
        User.findById((<any>req).user_id)

            .then((result) => {
                if (result == null) {
                    throw ({ name: 'not_found' })
                }
                res.status(200).json({ success: true, message: "User data", data: result });
            })
            .catch((err) => {
                next(err)
            })
    }
    static changeEmailOrUsername(req: Request, res: Response, next: NextFunction) {
        const { new_username, new_email } = req.body;
        const newData: any = { username: new_username, email: new_email }
        for (const key in newData) {
            if (!newData[key]) delete newData[key]
        }
        User.findByIdAndUpdate((<any>req).user_id, newData, { new: true })
            .then((result) => {
                res.status(200).json({ success: true, message: "Success change user data", data: result })
                next()
            })
            .catch((err) => {
                res.status(422).json({ success: false, message: err });
            })
    }
    static changePassword(req: Request, res: Response, next: NextFunction) {
        User.findByIdAndUpdate((<any>req).user_id, { password: bcrypt.hashSync(req.body.new_password, 8) }, { new: true }).select('+password')
            .then((result) => {
                res.status(200).json({ success: true, message: "Success change user password", data: result })
                next()
            })
            .catch((err) => {
                console.log(err)
                next(err)
            })
    }
    static async forgetPassword(req: Request, res: Response) {
        const inputEmail = req.body.email;
        const inputOriginUrl = req.body.originUrl;
        const getUser = await User.findOne({ email: inputEmail });
        const getUserName = getUser?.username;
        const getUserId = getUser?.id;
        const superkey: string = jwt.sign({ pesan: inputEmail }, process.env.TOKEN as string)
        const masterkey = bcrypt.hashSync(superkey, 8);
        const usermailer: string = process.env.USERMAILER as string;
        const passmailer: string = process.env.PASSMAILER as string;
        const hostmailer: string = process.env.HOSTMAILER as string;
        const portmailer: string = process.env.PORTMAILER as string;
        let linkChangePassword
        let mailOptions: any;
        let sendEmailToUser: any;
        let updateUser: any;

        try {
            linkChangePassword = inputOriginUrl + `/${getUserId}/${superkey}`;
            const transporter = nodemailer.createTransport({
                host: hostmailer,
                port: parseInt(portmailer),
                auth: {
                    user: usermailer,
                    pass: passmailer
                }
            });
            mailOptions = {
                from: '"Acong Kelontong" <acongkelontong@gmail.com>',
                to: inputEmail,
                subject: "Reset Password",
                text: `Dear ${getUserName}, please click the link below to reset your password
                ${linkChangePassword}
                `
            };
            sendEmailToUser = transporter.sendMail(mailOptions, (err: any, info: any) => { (err) ? console.log(err) : console.log("Email sent: " + info.responsive) });
            updateUser = await User.findOneAndUpdate({ email: inputEmail }, { masterkey: masterkey, }, { new: true })
        }
        catch (err) {
            res.status(422).json({ success: false, message: "forgotPassword update user failed!", data: err });
        }
        finally {
            res.status(201).json({ success: true, message: "chek your email" })
        }
    }
    static resetPassword(req: Request, res: Response, next: NextFunction) {
        User.findByIdAndUpdate(req.params.user_id, { password: bcrypt.hashSync(req.body.new_password, 8) }, { new: true }).select('+password')
            .then((result) => {
                res.status(200).json({ success: true, message: "Password changed! Please login" });
            })
            .catch((err) => {
                console.log(err)
                next(err)
            })
    }
}

export default userController