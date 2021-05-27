import { Router } from 'express'
import financeController from '../controllers/finance.controller'

class financeRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.getAllInvoice()
        this.updateInvoiceStatus()
    }


    public getAllInvoice(): void {
        this.router.get('/invoice', financeController.getAllInvoice);
    }
    public updateInvoiceStatus(): void {
        this.router.patch('/invoice/:invoice_id', financeController.updateInvoiceStatus);
    }
}

export default new financeRouter().router