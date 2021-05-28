import { Router } from 'express'
import ownerRouter from './owner.router'
import inventoryRouter from './inventory.router'
import financeRouter from './finance.router'
import cashierRouter from './cashier.router'

import userController from '../controllers/user.controller'

import errorHandler from '../middlewares/errorHandler'
import auth from '../middlewares/authJwt'
import acongController from '../controllers/acong.controller'

class Routes {
    router: Router
    constructor() {
        this.router = Router()
        this.developer()
        this.login()
        this.forgotPassword()
        this.resetPassword()
        this.authentication()
        this.owner()
        this.inventory()
        this.finance()
        this.cashier()
        this.accountDetails()
        this.changeEmailOrPhone()
        this.changePassword()
        this.logout()
        this.errorHandler()
    }
    public developer(): void {
        this.router.post('/create-acong', acongController.createAcong)
    }
    public login(): void {
        this.router.put('/login', userController.login)
    }
    public forgotPassword(): void {
        this.router.put('/login/forgot-password', userController.forgotPassword)
    }
    public resetPassword(): void { //create password for new user or forget password resetPassword
        this.router.patch('/login/reset-password/:user_id/:superkey', auth.resetPasswordAuth, userController.resetPassword);
    }
    public authentication(): void {
        this.router.use(auth.authentication)
    }
    public owner(): void {
        this.router.use(auth.ownerAuth, ownerRouter)
    }
    public inventory(): void {
        this.router.use(auth.inventoryAuth, inventoryRouter)
    }
    public finance(): void {
        this.router.use(auth.financeAuth, financeRouter)
    }
    public cashier(): void {
        this.router.use(auth.cashierAuth, cashierRouter)
    }
    public accountDetails(): void {
        this.router.get('/user', userController.myDetails);
    }
    public changeEmailOrPhone(): void {
        this.router.patch('/user/change-email-username', auth.twoStepAuth, auth.uniqueDataUser, userController.changeEmailOrUsername, userController.logout);
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