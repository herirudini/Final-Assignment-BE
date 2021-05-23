import { User } from '../models/User.model';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
// const nodemailer: any = require('nodemailer');
// const envEmail: any = process.env.EMAIL as string;
// const envEmailPass: any = process.env.EMAIL_PASS as string;
// const transporter: any = nodemailer.createTransport({ service: 'gmail', auth: { user: envEmail, pass: envEmailPass } })


class userController {
    static async createUser(req: Request, res: Response) {
        const role = req.body.role;
        const username = req.body.new_username;
        const email = req.body.new_email;
        const superkey: string = jwt.sign({ pesan: email }, process.env.TOKEN as string)
        const masterkey = bcrypt.hashSync(superkey, 8);
        let createUser: any;
        let mailOptions: any;
        let sendEmailToUser: any;
        let linkChangePassword: any;
        try {
            if (role == "inventory" || role == "finance" || role == "cashier") {
                createUser = await User.create({
                    role: role,
                    username: username,
                    email: email,
                    masterkey: masterkey,
                })
                linkChangePassword = `/${createUser.id}/${superkey}`
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
            res.status(201).json({ success: true, message: "create user success", data: createUser, linkChangePassword })
        }
    }
    static async login(req: Request, res: Response, next: NextFunction) {
        const user: any = await User.findOne({ email: (<any>req).body.email }).select('+password');
        const passwordIsValid: any = bcrypt.compareSync((<any>req).body.password, user.password);
        const token: string = jwt.sign({ id: user.id }, process.env.TOKEN as string)
        const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        const logIp = user.logIp;
        let ipExist = logIp.includes(ip)
        let signCredentials: any;
        let credentialsData: any;
        ipExist ? credentialsData = { logToken: token } : credentialsData = { $push: { logIp: ip }, logToken: token };

        try {
            // console.log(typeof(logIp))
            console.log("login Controller Ip exist?: " + ipExist)
            if (!user) { //wrong email
                throw ({ name: 'not_verified' })
            } else if (passwordIsValid) { //true email and password
                signCredentials = await User.findOneAndUpdate({ email: req.body.email }, credentialsData, { new: true });
                res.status(202).json({ success: true, message: "success login", data: signCredentials, AccessToken: token })
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
    static async myDetails(req: Request, res: Response, next: NextFunction) {
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
        const newData: any = { phone: new_username, email: new_email }
        for (const key in newData) {
            if (!newData[key]) delete newData[key]
        }
        User.findByIdAndUpdate((<any>req).user_id, newData, { new: true })
            .then((result) => {
                res.status(200).json({ success: true, message: "Email/Phone changed! You're logged out automatically ", data: result });
                next()
            })
            .catch((err) => {
                res.status(422).json({ success: false, message: err });
            })
    }
    static changePassword(req: Request, res: Response, next: NextFunction) {
        User.findByIdAndUpdate((<any>req).user_id, { password: bcrypt.hashSync(req.body.new_password, 8) }, { new: true }).select('+password')
            .then((result) => {
                res.status(200).json({ success: true, message: "Password changed! You're logged out automatically" });
                next()
            })
            .catch((err) => {
                console.log(err)
                next(err)
            })
    }
    static async forgotPassword(req: Request, res: Response) {
        const inputEmail = req.body.email;
        const superkey: string = jwt.sign({ pesan: inputEmail }, process.env.TOKEN as string)
        const masterkey = bcrypt.hashSync(superkey, 8);
        let linkChangePassword: string;
        let updateUser: any;

        try {
            updateUser = await User.findOneAndUpdate({ email: inputEmail }, { masterkey: masterkey, }, { new: true })
        }
        catch (err) {
            res.status(422).json({ success: false, message: "forgotPassword update user failed!", data: err });
        }
        finally {
            linkChangePassword = `/${updateUser.id}/${superkey}`
            res.status(201).json({ success: true, message: "chek your email", data: updateUser, linkChangePassword })
        }
    }
    static resetPassword(req: Request, res: Response, next: NextFunction) {
        User.findByIdAndUpdate(req.params.user_id, { password: bcrypt.hashSync(req.body.new_password, 8) }, { new: true }).select('+password')
            .then((result) => {
                res.status(200).json({ success: true, message: "Password changed! You're logged out automatically" });
                next()
            })
            .catch((err) => {
                console.log(err)
                next(err)
            })
    }
}

export default userController