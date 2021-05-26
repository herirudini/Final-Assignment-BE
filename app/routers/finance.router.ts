import { Router } from 'express'
import financeController from '../controllers/finance.controller'

class financeRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.getAllInvoice()
        this.updateInvoiceStatus()
        this.getCost()
        this.getIncome()
        this.createReport()
    }


    public getAllInvoice(): void {
        this.router.get('/invoice', financeController.getAllInvoice);
    }
    public updateInvoiceStatus(): void {
        this.router.patch('/invoice/:invoice_id', financeController.updateInvoiceStatus);
    }
    public getCost(): void {
        this.router.get('/income', financeController.getCost);
    }
    public getIncome(): void {
        this.router.get('/income', financeController.getIncome);
    }
    public createReport(): void {
        this.router.get('/income', financeController.createReport);
    }
}

export default new financeRouter().router