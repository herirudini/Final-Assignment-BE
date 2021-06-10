import { Router } from 'express'
import auth from '../middlewares/authJwt'
import inventoryRouter from './inventory.router'
import financeRouter from './finance.router'
import cashierRouter from './cashier.router'
import ownerController from '../controllers/owner.controller'

class ownerRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.createUser()
        this.listUser()
        this.cashflow()
        this.getTopProduct()
    }
    public createUser(): void {
        this.router.post('/create-user', auth.uniqueDataUser, ownerController.createUser);
    }
    public listUser(): void {
        this.router.get('/list-user', auth.uniqueDataUser, ownerController.listUser);
    }
    public cashflow(): void {
        this.router.put('/cashflow', ownerController.cashflow)
    }
    public getTopProduct(): void {
        this.router.get('/top-product', ownerController.getTopProduct)
    }
}

export default new ownerRouter().router