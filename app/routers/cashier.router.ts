import { Router } from 'express'
import cashierController from '../controllers/cashier.controller'

class cashierRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.getAllProduct()
        this.addToCart()
        this.searchProduct()
        this.addToCartManual()
        this.listCart()
        this.cancelItem()
        this.checkOut()
        this.listReceipt()
    }
    public getAllProduct(): void {
        this.router.get('/product', cashierController.getAllProduct);
    }
    public addToCart(): void {
        this.router.post('/product', cashierController.addToCart);
    }
    public searchProduct(): void {
        this.router.put('/product', cashierController.searchProduct);
    }
    public addToCartManual(): void {
        this.router.put('/product/:product_id', cashierController.addToCartManual);
    }
    public listCart(): void {
        this.router.get('/cart', cashierController.listCart);
    }
    public cancelItem(): void {
        this.router.put('/cart/:cart_id', cashierController.cancelItem, cashierController.listCart);
    }
    public checkOut(): void {
        this.router.post('/checkout', cashierController.checkOut, cashierController.listCart);
    }
    public listReceipt(): void {
        this.router.get('/receipt', cashierController.listReceipt);
    }
}

export default new cashierRouter().router