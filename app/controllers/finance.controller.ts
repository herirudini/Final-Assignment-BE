import { Request, Response, NextFunction } from 'express'
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
    static async updateInvoiceStatus(req: Request, res: Response, next: NextFunction) {

        const getSuplierId = req.params.invoice_id
        const checkInvoice = await Invoice.countDocuments({ suplier_id: getSuplierId, status: "unpaid" })
        let updateStatus;

        try {
            if (checkInvoice == 0) {
                res.status(400).json({ success: false, message: "No pending invoice for this suplier" })
            } else {
                updateStatus = await Invoice.findOneAndUpdate({ suplier_id: getSuplierId, status: "unpaid" }, { status: "paid" }, { new: true })
            }
        }
        catch (err) {
            next(err)
        }
    }
    static getCost(req: Request, res: Response, next: NextFunction) {

    }
    static getIncome(req: Request, res: Response, next: NextFunction) {

    }
}

export default financeController