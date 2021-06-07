import { Router } from 'express'
import ownerRouter from './owner.router'
import inventoryRouter from './inventory.router'
import financeRouter from './finance.router'
import cashierRouter from './cashier.router'

import userController from '../controllers/user.controller'

import errorHandler from '../middlewares/errorHandler'
import auth from '../middlewares/authJwt'
import ownerController from '../controllers/owner.controller'

class Routers {
    router: Router
    constructor() {
        this.router = Router()
        this.developer()
        this.login()
        this.forgetPassword()
        this.resetPassword()
        this.authentication()
        this.owner()
        this.inventory()
        this.finance()
        this.cashier()
        this.accountDetails()
        this.changeEmailOrUsername()
        this.changePassword()
        this.logout()
        this.errorHandler()
    }
    public developer(): void {
        this.router.post('/create-acong', ownerController.createAcong)
    }
    public login(): void {
        this.router.put('/login', userController.login)
    }
    public forgetPassword(): void {
        this.router.put('/login/forget-password', userController.forgetPassword)
    }
    public resetPassword(): void { //create password for new user or forget password resetPassword
        this.router.patch('/login/reset-password/:user_id/:superkey', auth.resetPasswordAuth, userController.resetPassword);
    }
    public authentication(): void {
        this.router.use(auth.authentication)
    }
    public owner(): void {
        this.router.use('/owner', auth.ownerAuth, ownerRouter)
    }
    public inventory(): void {
        this.router.use('/inventory', auth.inventoryAuth, inventoryRouter)
    }
    public finance(): void {
        this.router.use('/finance', auth.financeAuth, financeRouter)
    }
    public cashier(): void {
        this.router.use('/cashier', auth.cashierAuth, cashierRouter)
    }
    public accountDetails(): void {
        this.router.get('/user/details', userController.myDetails);
    }
    public changeEmailOrUsername(): void {
        this.router.patch('/user/change-email-username', auth.twoStepAuth, auth.uniqueDataUser, userController.changeEmailOrUsername, userController.logout);
    }
    public changePassword(): void {
        this.router.patch('/user/change-password', auth.twoStepAuth, userController.changePassword, userController.logout);
    }
    public logout(): void {
        this.router.delete('/logout', userController.logout)
    }
    public errorHandler(): void {
        this.router.use(errorHandler);
    }
}

export default new Routers().router