import { Router } from 'express'
import {inventoryController} from '../controllers/inventory.controller'

class inventoryRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.createBrand()
        this.createSuplier()
        this.createOrder()
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
}

export default new inventoryRouter().router