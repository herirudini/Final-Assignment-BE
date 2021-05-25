import { Router } from 'express'
import financeController from '../controllers/finance.controller'

class financeRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.getAllInvoice()
        this.updateInvoiceStatus()
        this.getAllReceipt()
        // this.report() //print invoice" yang akan dilaporkan kedalam format xls
    }


    private getAllInvoice(): void {
        this.router.get('/invoice', financeController.getAllInvoice);
    }
    private updateInvoiceStatus(): void {
        this.router.patch('/invoice/:invoice_id', financeController.updateInvoiceStatus);
    }
    private getAllReceipt(): void {
        this.router.get('/receipt', financeController.getAllReceipt);
    }
}

export default new financeRouter().router