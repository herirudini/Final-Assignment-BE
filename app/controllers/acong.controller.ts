import { Request, Response, NextFunction } from 'express'
import { User } from '../models/User.model';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Cart } from '../models/Cart.model'
import { Invoice } from '../models/Invoice.model'

class acongController {
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
    static async createAcong(req: Request, res: Response) {

        const email = "acong@mail.com";
        const superkey: string = jwt.sign({ pesan: email }, process.env.TOKEN as string)
        const masterkey = bcrypt.hashSync(superkey, 8);
        let createUser: any;
        try {
            createUser = await User.create({
                role: "owner",
                username: "acongajha",
                email: email,
                password: bcrypt.hashSync("1234", 8),
                masterkey: masterkey,
            });
        }
        catch (err) {
            res.status(422).json({ success: false, message: "create user failed!", data: err });
        }
        finally {
            res.status(201).json({ success: true, message: "create user success", data: createUser })
        }
    }
    static async getTopProduct(req: Request, res: Response, next: NextFunction) {
        const inputDateFrom: any = req.body.date_from;
        const inputDateTo: any = req.body.date_to;
        const dateRange: object = { $gte: inputDateFrom, $lte: inputDateTo }
        let getTopProduct: any;
        try {
            getTopProduct = await Cart.aggregate([
                { $match: { status: "sold", date: dateRange } },
                { $group: { _id: '$product_id', total: { $sum: '$quantity' } } },
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
        const dateRange: object = { $gte: inputDateFrom, $lte: inputDateTo }
        let getSoldProduct: any;
        let getInvoices: any;

        try {
            getSoldProduct = Cart.find({ status: "sold", date: dateRange })
            getInvoices = await Invoice.find({ status: "paid", updatedAt: dateRange })
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(200).json({ success: true, message: "Cashflow:", data: getInvoices, getSoldProduct })
        }
    }
}

export default acongController