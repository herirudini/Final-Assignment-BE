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

    public getAllProduct(): void {
        this.router.get('/product', cashierController.getAllProduct);
    }
    public addToCart(): void {
        this.router.put('/product', cashierController.addToCart);
    }
    public addToCartManual(): void {
        this.router.put('/product/:product_id', cashierController.addToCartManual);
    }
    public listCart(): void {
        this.router.get('/cart', cashierController.listCart);
    }
    public cancelItem(): void {
        this.router.patch('/cart/:cart_id', cashierController.cancelItem, cashierController.listCart);
    }
    public checkOut(): void {
        this.router.post('/checkout', cashierController.checkOut, cashierController.listCart);
    }
}

export default new cashierRouter().router