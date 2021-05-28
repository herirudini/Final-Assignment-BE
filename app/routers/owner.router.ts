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
        this.inventory()
        this.finance()
        this.cashier()
        this.cashflow()
        this.getTopProduct()
    }
    public createUser(): void {
        this.router.post('/user', auth.uniqueDataUser, ownerController.createUser);
    }
    public inventory(): void {
        this.router.use(inventoryRouter)
    }
    public finance(): void {
        this.router.use(financeRouter)
    }
    public cashier(): void {
        this.router.use(cashierRouter)
    }
    public cashflow(): void {
        this.router.get('/cashflow', ownerController.cashflow)
    }
    public getTopProduct(): void {
        this.router.get('/top-product', ownerController.getTopProduct)
    }
}

export default new ownerRouter().router