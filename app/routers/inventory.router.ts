import { Router } from 'express'
import inventoryController from '../controllers/inventory.controller'
import auth from '../middlewares/authJwt'
class inventoryRouter {
    router: Router
    constructor() {
        this.router = Router()
        // this.editOrder()
        this.createSuplier()
        this.listSuplier()
        this.listNames()
        this.createProduct()
        this.listProduct()
        this.searchProduct()
        this.setProductStatus()
        this.purchaseOrder()
        this.deliveryOrder()
    }
    // public createBrand(): void {
    //     this.router.post('/order/edit-order', inventoryController.editOrder);
    // }
    public createSuplier(): void {
        this.router.post('/suplier', auth.inventoryAuth, auth.uniqueDataSuplier, inventoryController.createSuplier);
    }
    public listSuplier(): void {
        this.router.get('/suplier', auth.inventoryAuth, inventoryController.listSuplier);
    }
    public listNames(): void {
        this.router.get('/list-names', auth.inventoryAuth, inventoryController.listNames);
    }
    public createProduct(): void {
        this.router.post('/product', auth.inventoryAuth, auth.uniqueDataProduct, inventoryController.createProduct);
    }
    public listProduct(): void {
        this.router.get('/product', auth.inventoryAuth, inventoryController.listProduct);
    }
    public searchProduct(): void {
        this.router.get('/product/search', auth.inventoryAuth, inventoryController.searchProduct);
    }
    public setProductStatus(): void {
        this.router.patch('/product/status/:product_id', auth.inventoryAuth, inventoryController.setProductStatus);
    }
    public purchaseOrder(): void {
        this.router.post('/purchase-order', auth.inventoryAuth, inventoryController.purchaseOrder);
    }
    public deliveryOrder(): void {
        this.router.post('/delivery-order', auth.inventoryAuth, inventoryController.deliveryOrder);
    }
}

export default new inventoryRouter().router