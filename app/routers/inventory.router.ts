import { Router } from 'express'
import inventoryController from '../controllers/inventory.controller'
import auth from '../middlewares/authJwt'
const multer = require('../middlewares/storage')

class inventoryRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.createSuplier()
        this.listSuplier()
        this.listBrandBySuplierName() // only retrive brand list
        this.listProductAndUomByBrandName() //only retrive product name and uom name
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
    public listBrandBySuplierName(): void {
        this.router.put('/list-brand', inventoryController.listBrandBySuplierName);
    }
    public listProductAndUomByBrandName(): void {
        this.router.put('/list-product-uom', inventoryController.listProductAndUomByBrandName);
    }
    public createProduct(): void {
        this.router.post('/product', auth.uniqueDataProduct, inventoryController.createProduct);
    }
    public getAllProduct(): void {
        this.router.get('/product', inventoryController.getAllProduct);
    }
    public searchProduct(): void {
        this.router.put('/product/search', inventoryController.searchProduct);
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