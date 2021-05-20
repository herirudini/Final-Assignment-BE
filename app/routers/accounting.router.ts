import { Router } from 'express'
import {accountingController} from '../controllers/accounting.controller'

class accountingRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.updateOrder() //memasukkan harga beli dan presentase laba
        this.createInvoice()
        this.listInvoice()
        this.getInvoiceBySuplier()
        this.getInvoiceByMonth()
        this.getInvoiceByDay()
        this.createReport() //print invoice" yang akan dilaporkan kedalam format xls
    }
    private updateOrder(): void {
        this.router.patch('/order/:order_id', accountingController.updateOrder);
    }
    private createInvoice(): void {
        this.router.post('/order', accountingController.createInvoice);
    }
    private listInvoice(): void {
        this.router.get('/invoice', accountingController.listInvoice);
    }
    private getInvoiceBySuplier(): void {
        this.router.get('/invoice/suplier/:suplier_id', accountingController.getInvoiceBySuplier);
    }
    private getInvoiceByMonth(): void {
        this.router.get('/invoice/month/:month', accountingController.getInvoiceByMonth);
    }
    private getInvoiceByDay(): void {
        this.router.get('/invoice/day/:day', accountingController.getInvoiceByDay);
    }
    private createReport(): void {
        this.router.post('/invoice', accountingController.createReport);
    }
}

export default new accountingRouter().router