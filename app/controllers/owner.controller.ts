import { Request, Response, NextFunction } from 'express'
import { User } from '../models/User.model';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Cart } from '../models/Cart.model'
import { Invoice } from '../models/Invoice.model'
const nodemailer = require('nodemailer')

class acongController {
    static async createUser(req: Request, res: Response) {
        const inputOriginUrl = req.body.originUrl;
        const role = req.body.role.toLowerCase();
        const username = req.body.new_username;
        const email = req.body.new_email;
        const superkey: string = jwt.sign({ pesan: email }, process.env.TOKEN as string);
        const masterkey: string = bcrypt.hashSync(superkey, 8);
        const usermailer: string = process.env.USERMAILER as string;
        const passmailer: string = process.env.PASSMAILER as string;
        const hostmailer: string = process.env.HOSTMAILER as string;
        const portmailer: string = process.env.PORTMAILER as string;
        let createUser: any;
        let mailOptions: any;
        let sendEmailToUser: any;
        let linkChangePassword: any;

        try {
            console.log("usermailer:", usermailer, passmailer)
            const transporter = nodemailer.createTransport({
                service: hostmailer,
                // port: parseInt(portmailer),
                auth: {
                    user: usermailer,
                    pass: passmailer
                }
            });
            if (role == "inventory" || role == "finance" || role == "cashier") {
                createUser = await User.create({
                    role: role,
                    username: username,
                    email: email,
                    masterkey: masterkey,
                })
                linkChangePassword = inputOriginUrl + `/${createUser.id}/${superkey}`;
                mailOptions = {
                    from: `"Acong Kelontong" <${usermailer}>`,
                    to: email,
                    subject: "Reset Password",
                    text: `Dear ${username}, please click the link below to reset your password
                    ${linkChangePassword}
                    `
                };
                sendEmailToUser = transporter.sendMail(mailOptions, (err: any, info: any) => { (err) ? console.log(err) : console.log("Email sent: " + info.responsive) });
                console.log(sendEmailToUser, inputOriginUrl)
            }
            else {
                res.status(422).json({ success: false, message: "create user failed! please choose a valid role: inventory/finance/cashier" });
            }
        }
        catch (err) {
            res.status(422).json({ success: false, message: "create user failed!", data: err });
        }
        finally {
            res.status(201).json({ success: true, message: "create user success", data: createUser })
        }
    }
    static listUser(req: Request, res: Response, next: NextFunction) {
        User.find()

            .then((result) => {
                if (result == null) {
                    throw ({ name: 'not_found' })
                }
                res.status(200).json({ success: true, message: "User list", data: result });
            })
            .catch((err) => {
                next(err)
            })
    }
    static async getTopProduct(req: Request, res: Response, next: NextFunction) {
        const inputDateFrom: any = req.body.date_from;
        const inputDateTo: any = req.body.date_to;
        const dateFrom = inputDateFrom + "T00:00:00.0000"
        const dateTo = inputDateTo + "T23:59:59.0000"
        const dateRange: object = { $gte: new Date(dateFrom), $lte: new Date(dateTo) };

        let getTopProduct: any;
        try {
            getTopProduct = await Cart.aggregate([
                { $match: { status: "sold", date: dateRange } },
                { $group: { _id: '$product', total: { $sum: '$quantity' } } },
                { $sort: { total: -1 } }
            ])
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(200).json({ success: true, message: "Top Products:", data: getTopProduct })
        }
    }
    static async cashflow(req: Request, res: Response, next: NextFunction) {
        const inputDateFrom: any = req.body.date_from;
        const inputDateTo: any = req.body.date_to;
        const dateFrom = inputDateFrom + "T00:00:00.0000"
        const dateTo = inputDateTo + "T23:59:59.0000"
        const dateRange: object = { $gte: dateFrom, $lte: dateTo }
        let getSoldProduct: any;
        let getInvoices: any;
        let data: object;
        try {
            getSoldProduct = await Cart.find({ status: "sold", updatedAt: dateRange })
            getInvoices = await Invoice.find({ status: "paid", updatedAt: dateRange })
            data = { outcome: getInvoices, income: getSoldProduct }
            res.status(200).json({ success: true, message: "Cashflow:", data: data })
        }
        catch (err) {
            next(err)
        }
    }
    static async createAcong(req: Request, res: Response) {
        const checkAcong = await User.countDocuments({ role: "owner" });
        const role = req.body.role;
        const username = req.body.new_username;
        const email = req.body.new_email;
        const password = bcrypt.hashSync("1234", 8)
        const superkey: string = jwt.sign({ pesan: email }, process.env.TOKEN as string)
        const masterkey = bcrypt.hashSync(superkey, 8);
        let createUser: any;
        try {
            console.log("password acong:" + password)
            if (checkAcong == 0) {
                createUser = await User.create({
                    role: role,
                    username: username,
                    email: email,
                    password: password,
                    masterkey: masterkey,
                });
            } else {
                res.status(422).json({ success: false, message: `acong sudah ada! email: ${email} password: 1234` });
            }
        }
        catch (err) {
            res.status(422).json({ success: false, message: "create user failed!", data: err });
        }
        finally {
            res.status(201).json({ success: true, message: "create user success", data: createUser })
        }
    }
}

export default acongController