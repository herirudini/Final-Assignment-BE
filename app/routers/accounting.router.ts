import { Router } from 'express'

class accountingRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.ngapainAja()
    }
    public ngapainAja(): void {
    }
    
}

export default new accountingRouter().router