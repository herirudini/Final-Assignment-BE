import { Router } from 'express'
import {accountingController} from '../controllers/accounting.controller'

class accountingRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.listRequestedOrder() //menampilkan pesanan pesanan yang belum diacc
        this.getRequestedOrder() //menampilkan pesanan yang belum diacc
        this.updateOrder() //memasukkan harga beli dan presentase laba
        this.createInvoice()
        this.getAllInvoice()
        this.getInvoiceBySuplier()
        this.getInvoiceByMonth()
        this.getInvoiceByWeek()
        this.getInvoiceByDay()
        this.createReport() //print invoice" yang akan dilaporkan kedalam format xls
    }
    private listRequestedOrder(): void {
        this.router.get('/order', accountingController.listRequestedOrder);
    }
    private getRequestedOrder(): void {
        this.router.get('/order/:order_id', accountingController.getRequestedOrder);
    }
    private updateOrder(): void {
        this.router.patch('/order/:order_id', accountingController.updateOrder);
    }
    private createInvoice(): void {
        this.router.post('/order', accountingController.createInvoice);
    }
    private getAllInvoice(): void {
        this.router.get('/invoice', accountingController.getAllInvoice);
    }
    private getInvoiceBySuplier(): void {
        this.router.get('/invoice/by-suplier/:suplier_id', accountingController.getInvoiceBySuplier);
    }
    private getInvoiceByMonth(): void {
        this.router.get('/invoice/by-date/:month', accountingController.getInvoiceByMonth);
    }
    private getInvoiceByWeek(): void {
        this.router.get('/invoice/by-date/:month/:week', accountingController.getInvoiceByWeek);
    }
    private getInvoiceByDay(): void {
        this.router.get('/invoice/by-date/:month/:week/:day', accountingController.getInvoiceByDay);
    }
    private createReport(): void {
        this.router.post('/invoice', accountingController.createReport);
    }
}

export default new accountingRouter().router