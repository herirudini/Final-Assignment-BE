"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const mongoURI = process.env.DATABASE;
const GridFsStorage = require('multer-gridfs-storage');
const storage = new GridFsStorage({
    url: `${mongoURI}`,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg", "image/jpg"];
        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}"-"${file.originalname}`;
            return filename;
        }
        else
            return {
                bucketName: "photos",
                filename: `${Date.now()}"-"${file.originalname}`
            };
    }
});
const uploadFile = multer_1.default({ storage: storage });
// const uploadFilesMiddleware = util.promisify(uploadFile);
exports.default = uploadFile;
