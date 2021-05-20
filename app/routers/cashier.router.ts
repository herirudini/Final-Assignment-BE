import { Router } from 'express'

class cashierRouter {
    router: Router
    constructor() {
        this.router = Router()
        this.ngapainAja()
    }
    public ngapainAja(): void {
    }
    
}

export default new cashierRouter().router