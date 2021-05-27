import { Router } from 'express'
import userController from '../controllers/user.controller'
import auth from '../middlewares/authJwt'
import inventoryRouter from './inventory.router'
import financeRouter from './finance.router'
import cashierRouter from './cashier.router'
import financeController from '../controllers/finance.controller'

class ownerRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.createUser()
        this.inventory()
        this.finance()
        this.cashier()
        this.getOutcome()
        this.getIncome()
        this.getTopProduct()
    }
    public createUser(): void {
        this.router.post('/user', auth.uniqueDataUser, userController.createUser);
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
    public getOutcome(): void {
        this.router.get('/outcome', financeController.getOutcome);
    }
    public getIncome(): void {
        this.router.get('/income', financeController.getIncome);
    }
    public getTopProduct(): void {
        this.router.get('/top-product', financeController.getTopProduct)
    }
}

export default new ownerRouter().router