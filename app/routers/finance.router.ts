import { Router } from 'express'
import {financeController} from '../controllers/finance.controller'

class financeRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.createInvoice()
        this.getAllInvoice()
        this.getInvoiceBySuplier()
        this.getInvoiceByMonth()
        this.getInvoiceByWeek()
        this.getInvoiceByDay()
        this.createReport() //print invoice" yang akan dilaporkan kedalam format xls
    }

    private createInvoice(): void {
        this.router.post('/order', financeController.createInvoice);
    }
    private getAllInvoice(): void {
        this.router.get('/invoice', financeController.getAllInvoice);
    }
    private getInvoiceBySuplier(): void {
        this.router.get('/invoice/by-suplier/:suplier_id', financeController.getInvoiceBySuplier);
    }
    private getInvoiceByMonth(): void {
        this.router.get('/invoice/by-date/:month', financeController.getInvoiceByMonth);
    }
    private getInvoiceByWeek(): void {
        this.router.get('/invoice/by-date/:month/:week', financeController.getInvoiceByWeek);
    }
    private getInvoiceByDay(): void {
        this.router.get('/invoice/by-date/:month/:week/:day', financeController.getInvoiceByDay);
    }
    private createReport(): void {
        this.router.post('/invoice', financeController.createReport);
    }
}

export default new financeRouter().router