import { Router } from 'express'

class inventoryRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.ngapainAja()
    }
    public ngapainAja(): void {
    }
    
}

export default new inventoryRouter().router