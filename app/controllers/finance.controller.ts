import { Request, Response, NextFunction } from 'express'
import { Cart } from '../models/Cart.model'
// import { Receipt } from '../models/Receipt.model'
import { Invoice } from '../models/Invoice.model'

class financeController {
    static getAllInvoice(req: Request, res: Response, next: NextFunction) {
        Invoice.find().populate('orders')
            .then((result) => {
                res.status(200).json({ success: true, message: "All Invoices: ", data: result })
            })
            .catch((err) => {
                next(err)
            })
    }
    static getInvoiceBySuplier(req: Request, res: Response, next: NextFunction) {
        const inputSuplierName: string = req.body.suplier_name;
        Invoice.find({ suplier_name: inputSuplierName }).populate('orders')
            .then((result) => {
                res.status(200).json({ success: true, message: "All Invoices: ", data: result })
            })
            .catch((err) => {
                next(err)
            })
    }
    static async updateInvoiceStatus(req: Request, res: Response, next: NextFunction) {

        const getId = req.params.invoice_id
        const checkInvoice = await Invoice.countDocuments({ _id: getId, status: "unpaid" })
        let updateStatus;

        try {
            if (checkInvoice == 0) {
                throw ({ name: "not_found" })
            } else {
                updateStatus = await Invoice.findOneAndUpdate({ _id: getId, status: "unpaid" }, { status: "paid" }, { new: true })
            }
        }
        catch (err) {
            next(err)
        }
    }
    static async getOutcome(req: Request, res: Response, next: NextFunction) {
        const inputDateFrom: any = req.body.date_from;
        const inputDateTo: any = req.body.date_to;
        const dateRange: object = { $gte: inputDateFrom, $lte: inputDateTo }
        let getInvoices: any;
        try {
            getInvoices = await Invoice.find({ status: "paid", updatedAt: dateRange })
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(200).json({ success: true, message: "paid invoices:", data: getInvoices })
        }
    }
    static async getIncome(req: Request, res: Response, next: NextFunction) {
        const inputDateFrom: any = req.body.date_from;
        const inputDateTo: any = req.body.date_to;
        const dateRange: object = { $gte: inputDateFrom, $lte: inputDateTo }
        let getSoldProduct: any;
        try {
            getSoldProduct = Cart.find({ status: "sold", date: dateRange })
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(200).json({ success: true, message: "sold products:", data: getSoldProduct })
        }
    }
}

export default financeController