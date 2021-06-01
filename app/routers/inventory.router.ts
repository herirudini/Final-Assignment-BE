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
        this.router.post('/suplier', auth.uniqueDataSuplier, inventoryController.createSuplier);
    }
    public listSuplier(): void {
        this.router.get('/suplier', inventoryController.listSuplier);
    }
    public listBrand(): void {
        this.router.get('/list-brand', inventoryController.listBrand);
    }
    public listProductAndUom(): void {
        this.router.get('/list-product-uom', inventoryController.listProductAndUom);
    }
    public createProduct(): void {
        this.router.post('/product', auth.uniqueDataProduct, inventoryController.createProduct);
    }
    public getAllProduct(): void {
        this.router.get('/product', inventoryController.getAllProduct);
    }
    public searchProduct(): void {
        this.router.get('/product/search', inventoryController.searchProduct);
    }
    public setProductStatus(): void {
        this.router.patch('/product/status/:product_id', inventoryController.setProductStatus, inventoryController.getAllProduct);
    }
    public editProduct(): void {
        this.router.patch('/product/edit/:product_id', inventoryController.editProduct, inventoryController.getAllProduct);
    }
    public purchaseOrder(): void {
        this.router.post('/purchase-order', inventoryController.purchaseOrder);
    }
    public deliveryOrder(): void {
        this.router.post('/delivery-order', inventoryController.deliveryOrder);
    }
}

export default new inventoryRouter().router