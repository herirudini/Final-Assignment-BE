import { Router } from 'express'
import inventoryController from '../controllers/inventory.controller'
import auth from '../middlewares/authJwt'
class inventoryRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.createSuplier()
        this.listSuplier()
        this.listBrand()
        this.listProductAndUom()
        this.createProduct()
        this.getAllProduct()
        this.searchProduct()
        this.setProductStatus()
        this.editProduct()
        this.purchaseOrder()
        this.deliveryOrder()
    }
    public createSuplier(): void {
        this.router.post('/suplier', auth.inventoryAuth, auth.uniqueDataSuplier, inventoryController.createSuplier);
    }
    public listSuplier(): void {
        this.router.get('/suplier', auth.inventoryAuth, inventoryController.listSuplier);
    }
    public listBrand(): void {
        this.router.get('/list-brand', auth.inventoryAuth, inventoryController.listBrand);
    }
    public listProductAndUom(): void {
        this.router.get('/list-product-uom', auth.inventoryAuth, inventoryController.listProductAndUom);
    }
    public createProduct(): void {
        this.router.post('/product', auth.inventoryAuth, auth.uniqueDataProduct, inventoryController.createProduct);
    }
    public getAllProduct(): void {
        this.router.get('/product', auth.inventoryAuth, inventoryController.getAllProduct);
    }
    public searchProduct(): void {
        this.router.get('/product/search', auth.inventoryAuth, inventoryController.searchProduct);
    }
    public setProductStatus(): void {
        this.router.patch('/product/status/:product_id', auth.inventoryAuth, inventoryController.setProductStatus, inventoryController.getAllProduct);
    }
    public editProduct(): void {
        this.router.patch('/product/edit/:product_id', auth.inventoryAuth, inventoryController.editProduct, inventoryController.getAllProduct);
    }
    public purchaseOrder(): void {
        this.router.post('/purchase-order', auth.inventoryAuth, inventoryController.purchaseOrder);
    }
    public deliveryOrder(): void {
        this.router.post('/delivery-order', auth.inventoryAuth, inventoryController.deliveryOrder);
    }
}

export default new inventoryRouter().router