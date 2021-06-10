import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { User } from '../models/User.model'
import { Suplier } from '../models/Suplier.model'
import { Product } from '../models/Product.model'

class auth {
    static async authentication(req: Request, res: Response, next: NextFunction) {
        const access_token: string = (<any>req).headers.access_token;
        const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

        try {

            if (!access_token) {
                console.log("Incorrect Token: Please Login")
                throw ({ name: 'missing_token' })

            } else {
                jwt.verify(access_token, process.env.TOKEN as string, (err, decoded: any) => {
                    if (err) {
                        throw ({ name: 'invalid_token' })
                    }
                    (<any>req).user_id = decoded.id;
                })
                const author: any = await User.findById((<any>req).user_id);
                // const logToken = author.logToken;
                const logIp = author.logIp;
                let ipExist = logIp.includes(ip)

                if (ipExist == false) {
                    throw ({ name: 'unauthorized' })
                } else {
                    console.log("berhasil lewat Authentication")
                    next();
                }
            }
        }
        catch (err) {
            console.log("masuk catch auth:" + err)
            next(err)
        }
    }

    static async uniqueDataUser(req: Request, res: Response, next: NextFunction) { //res JANGAN DIHAPUS nanti tidak terdeteksi oleh router
        const inputEmail: string = req.body.new_email;
        const inputUsername: string = req.body.new_username;
        const checkUserByEmail: any = await User.countDocuments({ email: inputEmail })
        const checkUserByName: any = await User.countDocuments({ username: inputUsername })
        try {
            if (checkUserByEmail != 0) {
                throw ({ name: 'unique_email' })
            } else if (checkUserByName != 0) {
                throw ({ name: 'unique_username' })
            } else {
                next()
            }
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }
    static async uniqueDataSuplier(req: Request, res: Response, next: NextFunction) { //res JANGAN DIHAPUS nanti tidak terdeteksi oleh router
        const inputSuplierName: string = req.body.suplier_name.toUpperCase()
        const checkSuplierByName: any = await Suplier.countDocuments({ name: inputSuplierName })
        try {
            if (checkSuplierByName != 0) {
                throw ({ name: 'unique_name' })
            } else {
                next()
            }
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }
    static async uniqueDataProduct(req: Request, res: Response, next: NextFunction) { //res JANGAN DIHAPUS nanti tidak terdeteksi oleh router
        const inputBarcode = req.body.barcode
        const checkProductByBarcode: any = await Product.countDocuments({ barcode: inputBarcode })
        try {
            if (checkProductByBarcode != 0) {
                throw ({ name: 'unique_barcode' })
            } else {
                next()
            }
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }
    static async twoStepAuth(req: Request, res: Response, next: NextFunction) {
        const getUser: any = await User.findById((<any>req).user_id).select('+password')
        const inputPassword: string = req.body.password;
        try {
            if (!inputPassword) {
                res.status(402).json({ success: false, message: "Please input password!" })
            } else {
                const match = bcrypt.compareSync(req.body.password, getUser.password);
                if (!match) {
                    throw ({ name: 'twostep_auth' })
                } else {
                    next()
                }
            }
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }
    static async resetPasswordAuth(req: Request, res: Response, next: NextFunction) {
        const userId: string = req.params.user_id;
        const secretToken: string = req.params.superkey;
        const getUser: any = await User.findById(userId).select('+masterkey')

        try {
            if (!secretToken || !userId) {
                res.status(402).json({ success: false, message: "Ultra-Terrestrial ERROR" })
            } else {
                const match = bcrypt.compareSync(secretToken, getUser.masterkey);
                if (!match) {
                    res.status(402).json({ success: false, message: "Ultra-Terrestrial ERROR !match" })
                } else {
                    next()
                }
            }
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }
    static async ownerAuth(req: Request, res: Response, next: NextFunction) { //res JANGAN DIHAPUS nanti tidak terdeteksi oleh router
        const author: any = await User.findById((<any>req).user_id)
        try {
            console.log("ownerAuth:")
            if (!author) {
                throw ({ name: 'not_found' })
            } else if (author.role == "owner") {
                next()
            } else {
                throw ({ name: 'unauthorized' })
            }
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }
    static async inventoryAuth(req: Request, res: Response, next: NextFunction) { //res JANGAN DIHAPUS nanti tidak terdeteksi oleh router
        const author: any = await User.findById((<any>req).user_id)
        try {
            if (!author) {
                throw ({ name: 'not_found' })
            } else if (author.role == "inventory" || author.role == "owner") {
                next()
            } else {
                throw ({ name: 'unauthorized' })
            }
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }
    static async financeAuth(req: Request, res: Response, next: NextFunction) { //res JANGAN DIHAPUS nanti tidak terdeteksi oleh router
        const author: any = await User.findById((<any>req).user_id)
        try {
            if (!author) {
                throw ({ name: 'not_found' })
            } else if (author.role == "finance" || author.role == "owner") {
                next()
            } else {
                throw ({ name: 'unauthorized' })
            }
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }
    static async cashierAuth(req: Request, res: Response, next: NextFunction) { //res JANGAN DIHAPUS nanti tidak terdeteksi oleh router
        const author: any = await User.findById((<any>req).user_id)
        try {
            if (!author) {
                throw ({ name: 'not_found' })
            } else if (author.role == "cashier" || author.role == "owner") {
                next()
            } else {
                throw ({ name: 'unauthorized' })
            }
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }
}

export default auth