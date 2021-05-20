import { Router } from 'express'
import userController from '../controllers/user.controller'
import auth from '../middlewares/authJwt'
import inventoryRouter from './inventory.router'
import accountingRouter from './accounting.router'
import cashierRouter from './cashier.router'

class ownerRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.createUser()
        this.inventory()
        this.accounting()
        this.cashier()
    }
    private createUser(): void {
        this.router.post('/user', auth.uniqueData, userController.createUser);
    }
    private inventory(): void {
        this.router.use(inventoryRouter)
    }
    private accounting(): void {
        this.router.use(accountingRouter)
    }
    private cashier(): void {
        this.router.use(cashierRouter)
    }
    
}

export default new ownerRouter().router