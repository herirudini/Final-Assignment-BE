import { Router } from 'express'
import ownerRouter from './owner.router'
import inventoryRouter from './inventory.router'
import accountingRouter from './accounting.router'
import cashierRouter from './cashier.router'

import userController from '../controllers/user.controller'

import errorHandler from '../middlewares/errorHandler'
import auth from '../middlewares/authJwt'

class Routes {
    router: Router
    constructor() {
        this.router = Router()
        this.login()
        this.authentication()
        this.owner()
        this.inventory()
        this.accounting()
        this.cashier()
        this.accountDetails()
        this.changeEmailOrPhone()
        this.changePassword()
        this.logout()
        this.errorHandler()
    }

    public login(): void {
        this.router.put('/login', userController.login)
    }  
    public authentication(): void {
        this.router.use(auth.authentication)
    }
    private owner(): void {
        this.router.use(auth.ownerAuth, ownerRouter)
    }
    private inventory(): void {
        this.router.use(auth.inventoryAuth, inventoryRouter)
    }
    private accounting(): void {
        this.router.use(auth.accountingAuth, accountingRouter)
    }
    private cashier(): void {
        this.router.use(auth.cashierAuth, cashierRouter)
    }
    public accountDetails(): void {
        this.router.get('/user', userController.myDetails);
    }
    public changeEmailOrPhone(): void {
        this.router.patch('/user/change-email-username', auth.twoStepAuth, auth.uniqueData, userController.changeEmailOrUsername, userController.logout);
    }
    public changePassword(): void {
        this.router.patch('/user/change-password', auth.twoStepAuth, userController.changePassword, userController.logout);
    }
    public logout(): void {
        this.router.patch('/logout', userController.logout)
    }
    public errorHandler(): void {
        this.router.use(errorHandler);
    }
}

export default new Routes().router