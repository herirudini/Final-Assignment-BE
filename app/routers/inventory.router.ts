import { Router } from 'express'
import inventoryController from '../controllers/inventory.controller'
import auth from '../middlewares/authJwt'
class inventoryRouter {
    router: Router
    constructor() {
        this.router = Router()
        // this.editOrder()
        this.createSuplier()
        this.createProduct()
        this.createOrder()
        this.confirmDelivery()
        this.getAllProduct()
        this.setProductStatus()
    }
    // private createBrand(): void {
    //     this.router.post('/order/edit-order', inventoryController.editOrder);
    // }
    private createSuplier(): void {
        this.router.post('/suplier', auth.uniqueDataSuplier, inventoryController.createSuplier);
    }
    private createProduct(): void {
        this.router.post('/product', inventoryController.createProduct);
    }
    private createOrder(): void {
        this.router.post('/purchase-order', inventoryController.purchaseOrder);
    }
    private getAllProduct(): void {
        this.router.get('/product', inventoryController.getAllProduct);
    }
    private setProductStatus(): void {
        this.router.patch('/product/:product_id', inventoryController.setProductStatus);
    }
    private confirmDelivery(): void {
        this.router.post('/delivery-order', inventoryController.deliveryOrder);
    }
}

export default new inventoryRouter().router