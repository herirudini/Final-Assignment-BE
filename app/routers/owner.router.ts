import { Router } from 'express'
import userController from '../controllers/user.controller'
import auth from '../middlewares/authJwt'
import inventoryRouter from './inventory.router'
import financeRouter from './finance.router'
import cashierRouter from './cashier.router'

class ownerRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.createUser()
        this.inventory()
        this.finance()
        this.cashier()
    }
    private createUser(): void {
        this.router.post('/user', auth.uniqueDataUser, userController.createUser);
    }
    private inventory(): void {
        this.router.use(inventoryRouter)
    }
    private finance(): void {
        this.router.use(financeRouter)
    }
    private cashier(): void {
        this.router.use(cashierRouter)
    }
    
}

export default new ownerRouter().router