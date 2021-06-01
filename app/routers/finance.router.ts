import { Router } from 'express'
import financeController from '../controllers/finance.controller'
import auth from '../middlewares/authJwt'

class financeRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.getAllInvoice()
        this.getInvoiceBySuplier()
        this.getInvoiceById()
        this.updateInvoiceStatus()
        this.getOutcome()
        this.getIncome()
    }

    public getAllInvoice(): void {
        this.router.get('/invoice', financeController.getAllInvoice);
    }
    public getInvoiceBySuplier(): void {
        this.router.get('/invoice/suplier', financeController.getInvoiceBySuplier);
    }
    public getInvoiceById(): void {
        this.router.get('/invoice/suplier/:invoice_id', financeController.getInvoiceById);
    }
    public updateInvoiceStatus(): void {
        this.router.patch('/invoice/suplier/:invoice_id', financeController.updateInvoiceStatus);
    }
    public getOutcome(): void {
        this.router.get('/outcome', financeController.getOutcome);
    }
    public getIncome(): void {
        this.router.get('/income', financeController.getIncome);
    }
}

export default new financeRouter().router