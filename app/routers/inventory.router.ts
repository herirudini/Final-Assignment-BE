import { Router } from 'express'
import inventoryController from '../controllers/inventory.controller'

class inventoryRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.createBrand()
        this.createSuplier()
        this.createOrder()
        this.createProduct()
        this.confirmDelivery()
        this.getAllProduct()
        this.setProductStatus()
    }
    private createBrand(): void {
        this.router.post('/brand', inventoryController.createBrand);
    }
    private createSuplier(): void {
        this.router.post('/suplier', inventoryController.createSuplier);
    }
    private createOrder(): void {
        this.router.post('/purchase-order', inventoryController.createOrder);
    }
    private createProduct(): void {
        this.router.post('/product', inventoryController.createProduct);
    }
    private getAllProduct(): void {
        this.router.get('/product', inventoryController.getAllProduct);
    }
    private setProductStatus(): void {
        this.router.patch('/product/:product_id', inventoryController.setProductStatus);
    }
    private confirmDelivery(): void {
        this.router.post('/delivery', inventoryController.confirmDelivery);
    }
}

export default new inventoryRouter().router