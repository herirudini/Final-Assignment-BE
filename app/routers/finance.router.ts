import { Router } from 'express'
import financeController from '../controllers/finance.controller'
import auth from '../middlewares/authJwt'

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
        this.router.get('/invoice', auth.financeAuth, financeController.getAllInvoice);
    }
    public updateInvoiceStatus(): void {
        this.router.patch('/invoice/:invoice_id', auth.financeAuth, financeController.updateInvoiceStatus);
    }
    public getOutcome(): void {
        this.router.get('/outcome', auth.financeAuth, financeController.getOutcome);
    }
    public getIncome(): void {
        this.router.get('/income', auth.financeAuth, financeController.getIncome);
    }
}

export default new financeRouter().router