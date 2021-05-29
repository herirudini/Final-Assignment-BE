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
        this.purchaseOrder()
        this.deliveryOrder()
        this.searchProduct()
        this.setProductStatus()
    }
    // public createBrand(): void {
    //     this.router.post('/order/edit-order', inventoryController.editOrder);
    // }
    public createSuplier(): void {
        this.router.post('/suplier', auth.inventoryAuth, auth.uniqueDataSuplier, inventoryController.createSuplier);
    }
    public createProduct(): void {
        this.router.post('/product', auth.inventoryAuth, auth.uniqueDataProduct, inventoryController.createProduct);
    }
    public purchaseOrder(): void {
        this.router.post('/purchase-order', auth.inventoryAuth, inventoryController.purchaseOrder);
    }
    public searchProduct(): void {
        this.router.get('/product', auth.inventoryAuth, inventoryController.searchProduct);
    }
    public setProductStatus(): void {
        this.router.patch('/product/:product_id', auth.inventoryAuth, inventoryController.setProductStatus);
    }
    public deliveryOrder(): void {
        this.router.post('/delivery-order', auth.inventoryAuth, inventoryController.deliveryOrder);
    }
}

export default new inventoryRouter().router