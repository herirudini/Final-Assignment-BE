import { Router } from 'express'
import cashierController from '../controllers/cashier.controller'
import auth from '../middlewares/authJwt'

class cashierRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.searchProduct()
        this.addToCart()
        this.addToCartManual()
        this.listCart()
        this.cancelItem()
        this.checkOut()
        // this.report() //print invoice" yang akan dilaporkan kedalam format xls
    }

    public searchProduct(): void {
        this.router.get('/product', auth.cashierAuth, cashierController.searchProduct);
    }
    public addToCart(): void {
        this.router.put('/product', auth.cashierAuth, cashierController.addToCart);
    }
    public addToCartManual(): void {
        this.router.put('/product/:product_id', auth.cashierAuth, cashierController.addToCartManual);
    }
    public listCart(): void {
        this.router.get('/cart', auth.cashierAuth, cashierController.listCart);
    }
    public cancelItem(): void {
        this.router.patch('/cart/:cart_id', auth.cashierAuth, cashierController.cancelItem, cashierController.listCart);
    }
    public checkOut(): void {
        this.router.post('/checkout', auth.cashierAuth, cashierController.checkOut, cashierController.listCart);
    }
}

export default new cashierRouter().router