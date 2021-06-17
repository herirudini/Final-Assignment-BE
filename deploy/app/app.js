"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routers_1 = __importDefault(require("./routers/routers"));
const connect_database_1 = __importDefault(require("../config/connect-database"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_form_data_1 = __importDefault(require("express-form-data"));
const os_1 = __importDefault(require("os"));
const bodyParser = require('body-parser');
class App {
    constructor() {
        dotenv_1.default.config();
        this.app = express_1.default();
        this.plugin();
        this.cors();
        this.connectDB();
        this.routes();
    }
    plugin() {
        this.app.use(express_1.default.json({ limit: '16mb' }));
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(express_form_data_1.default.parse({ uploadDir: os_1.default.tmpdir(), autoClean: true }));
        this.app.use(express_form_data_1.default.format());
        this.app.use(express_form_data_1.default.stream());
        this.app.use(express_form_data_1.default.union());
        // this.app.use(bodyParser.json());
        // this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    cors() {
        this.app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
            next();
        });
        this.app.use(cors_1.default());
    }
    connectDB() {
        connect_database_1.default();
    }
    routes() {
        // this.app.use('../uploads', express.static(path.join('uploads')));
        this.app.use(routers_1.default);
    }
}
const app = new App().app;
const port = process.env.PORT;
app.listen(port, () => { console.log(`listening to http://localhost:${port}/`); });
