import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { User } from '../models/User.model'


class auth {
    static async authentication(req: Request, res: Response, next: NextFunction) {
        const access_token: string = (<any>req).headers.access_token;
        const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

        try {
            // console.log("access_tokennya: " + access_token)

            if (!access_token) {
                console.log("Incorrect Token: Please Login")
                throw ({ name: 'missing_token' })
                // res.redirect('../../login')

            } else {
                jwt.verify(access_token, process.env.TOKEN as string, (err, decoded: any) => {
                    if (err) {
                        throw ({ name: 'invalid_token' })
                    }
                    (<any>req).user_id = decoded.id;
                })
                const author: any = await User.findById((<any>req).user_id);
                const logToken = author.logToken;
                const logIp = author.logIp;
                let ipExist = logIp.includes(ip)

                if (ipExist == false || logToken != access_token) {
                    throw ({ name: 'invalid_token' })
                    // res.redirect('../login');
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
    static async uniqueData(req: Request, res: Response, next: NextFunction) { //res JANGAN DIHAPUS nanti tidak terdeteksi oleh router
        const checkEmail: any = await User.countDocuments({ email: req.body.new_email })
        const checkUsername: any = await User.countDocuments({ phone: req.body.new_username })
        try {
            if (checkEmail != 0) {
                throw ({ name: 'unique_email' })
            } else if (checkUsername != 0) {
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
    static async twoStepAuth(req: Request, res: Response, next: NextFunction) {
        const author: any = await User.findById((<any>req).user_id).select('+password')

        try {
            if (!req.body.password) {
                res.status(402).json({ success: false, message: "Please input password!" })
            } else {
                const match = bcrypt.compareSync(req.body.password, author.password);
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
    static async ownerAuth(req: Request, res: Response, next: NextFunction) { //res JANGAN DIHAPUS nanti tidak terdeteksi oleh router
        const author: any = await User.findById((<any>req).user_id)
        try {
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
    static async accountingAuth(req: Request, res: Response, next: NextFunction) { //res JANGAN DIHAPUS nanti tidak terdeteksi oleh router
        const author: any = await User.findById((<any>req).user_id)
        try {
            if (!author) {
                throw ({ name: 'not_found' })
            } else if (author.role == "accounting" || author.role == "owner") {
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