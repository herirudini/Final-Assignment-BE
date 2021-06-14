import { Application } from 'express'
import express from 'express'
import Routers from './routers/routers'
import connectDB from '../config/connect-database'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import formData from 'express-form-data'
import os from 'os'

const bodyParser = require('body-parser')

class App {
   public app: Application
   constructor() {
      dotenv.config()
      this.app = express()
      this.plugin()
      this.cors()
      this.connectDB()
      this.routes()
   }

   protected plugin(): void {
      this.app.use(express.json());
      this.app.use(express.urlencoded({ extended: false }));
      this.app.use(formData.parse({ uploadDir: os.tmpdir(), autoClean: true }));
      this.app.use(formData.format());
      this.app.use(formData.stream());
      this.app.use(formData.union());

      // this.app.use(bodyParser.json());
      // this.app.use(bodyParser.urlencoded({ extended: false }));
   }
   protected cors(): void {
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
      this.app.use(cors());
   }
   protected connectDB(): void {
      connectDB();
   }
   protected routes(): void {
      this.app.use('../uploads', express.static(path.join('uploads')));
      this.app.use(Routers)
   }
}
const app = new App().app
const port: any = process.env.PORT
app.listen(port, () => { console.log(`listening to http://localhost:${port}/`) })