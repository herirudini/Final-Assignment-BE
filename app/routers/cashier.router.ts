import { Router } from 'express'
import cashierController from '../controllers/cashier.controller'
import auth from '../middlewares/authJwt'

class cashierRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.addToCart()
        this.searchProduct()
        this.addToCartManual()
        this.listCart()
        this.cancelItem()
        this.checkOut()
        // this.report() //print invoice" yang akan dilaporkan kedalam format xls
    }
    public addToCart(): void {
        this.router.put('/product', cashierController.addToCart);
    }
    public searchProduct(): void {
        this.router.get('/product', cashierController.searchProduct);
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