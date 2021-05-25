import { Router } from 'express'
import cashierController from '../controllers/cashier.controller'

class cashierRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.getAllProduct()
        this.addToCart()
        this.addToCartManual()
        this.listCart()
        this.cancelItem()
        this.checkOut()
        // this.report() //print invoice" yang akan dilaporkan kedalam format xls
    }

    private getAllProduct(): void {
        this.router.get('/product', cashierController.getAllProduct);
    }
    private addToCart(): void {
        this.router.put('/product', cashierController.addToCart);
    }
    private addToCartManual(): void {
        this.router.put('/product/:product_id', cashierController.addToCartManual);
    }
    private listCart(): void {
        this.router.get('/cart', cashierController.listCart);
    }
    private cancelItem(): void {
        this.router.patch('/cart/:cart_id', cashierController.cancelItem);
    }
    private checkOut(): void {
        this.router.post('/checkout', cashierController.checkOut);
    }
}

export default new cashierRouter().router