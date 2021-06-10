import { Application } from 'express'
import express from 'express'
import Routers from './routers/routers'
import connectDB from '../config/connect-database'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import bodyParser = require('body-parser')

class App {
   public app: Application
   constructor() {
      dotenv.config()
      this.app = express()
      this.plugin()
      this.cors()
      this.routes()
   }

   protected plugin(): void {
      this.app.use(express.urlencoded({ extended: true }))
      this.app.use(express.json());
      this.app.use(bodyParser.json());
      this.app.use('../assets/product-images', express.static(path.join('images')));
      connectDB();
   }
   protected cors(): void {
      this.app.use(cors())
      this.app.use((req, res, next) => {
         res.setHeader("Access-Control-Allow-Origin", "*");
         res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
         );
         res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PATCH, PUT, DELETE, OPTIONS"
         );
         next();
      });
   }
   protected routes(): void {
      this.app.use(Routers)
   }
}
const app = new App().app
const port: any = process.env.PORT
app.listen(port, () => { console.log(`listening to http://localhost:${port}/`) })