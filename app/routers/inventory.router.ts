import { Router } from 'express'
import inventoryController from '../controllers/inventory.controller'

class inventoryRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.createBrand()
        this.createSuplier()
        this.createOrder()
        this.confirmDelivery()
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
    private confirmDelivery(): void {
        this.router.post('/delivery-order/:order_id', inventoryController.confirmDelivery);
    }
}

export default new inventoryRouter().router