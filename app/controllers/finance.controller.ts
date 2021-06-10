import { Request, Response, NextFunction } from 'express'
import { Cart } from '../models/Cart.model'
// import { Receipt } from '../models/Receipt.model'
import { Invoice } from '../models/Invoice.model'
import { Suplier } from '../models/Suplier.model'

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
    static async getInvoiceBySuplier(req: Request, res: Response, next: NextFunction) {
        const inputSuplierName: string = req.body.suplier_name.toUpperCase();
        let listInvoice: any;
        try {
            listInvoice = await Invoice.find({ suplier_name: inputSuplierName }).populate('orders')
            res.status(200).json({ success: true, message: "All Invoices: ", data: listInvoice })
        }
        catch (err) {
            next(err)
        }
    }
    static async getInvoiceById(req: Request, res: Response, next: NextFunction) {
        const getInvoiceId = req.params.invoice_id;
        Invoice.findById(getInvoiceId).populate('orders')
            .then((result) => {
                res.status(200).json({ success: true, message: "Invoices details: ", data: result })

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
            };
            res.status(200).json({ success: true, message: "Invoice Updated!", data: updateStatus })
        }
        catch (err) {
            next(err)
        }
    }
    static async getOutcome(req: Request, res: Response, next: NextFunction) {
        const inputDateFrom: any = req.body.date_from;
        const inputDateTo: any = req.body.date_to;
        const dateFrom = inputDateFrom + "T00:00:00.0000"
        const dateTo = inputDateTo + "T23:59:59.0000"
        const dateRange: object = { $gte: dateFrom, $lte: dateTo }
        let getInvoices: any;
        try {
            getInvoices = await Invoice.find({ status: "paid", updatedAt: dateRange })
        }
        catch (err) {
            res.status(500).json({success: false, message: "gagal maning", err})
        }
        finally {
            res.status(200).json({ success: true, message: "paid invoices:", data: getInvoices })
        }
    }
    static async getIncome(req: Request, res: Response, next: NextFunction) {
        const inputDateFrom: any = req.body.date_from;
        const inputDateTo: any = req.body.date_to;
        const dateFrom = inputDateFrom + "T00:00:00.0000"
        const dateTo = inputDateTo + "T23:59:59.0000"
        const dateRange: object = { $gte: dateFrom, $lte: dateTo }
        let getSoldProduct: any;
        try {
            getSoldProduct = await Cart.find({ status: "sold", updatedAt: dateRange })
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