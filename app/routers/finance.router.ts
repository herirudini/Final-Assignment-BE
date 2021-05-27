import { Router } from 'express'
import financeController from '../controllers/finance.controller'

class financeRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.getAllInvoice()
        this.updateInvoiceStatus()
        this.getOutcome()
        this.getIncome()
    }

    public getAllInvoice(): void {
        this.router.get('/invoice', financeController.getAllInvoice);
    }
    public updateInvoiceStatus(): void {
        this.router.patch('/invoice/:invoice_id', financeController.updateInvoiceStatus);
    }
    public getOutcome(): void {
        this.router.get('/outcome', financeController.getOutcome);
    }
    public getIncome(): void {
        this.router.get('/income', financeController.getIncome);
    }
}

export default new financeRouter().router