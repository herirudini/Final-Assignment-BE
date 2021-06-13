"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const multer_1 = __importDefault(require("multer"));
const mongoURI = process.env.DATABASE;
const GridFsStorage = require('multer-gridfs-storage');
const storage = new GridFsStorage({
    url: `${mongoURI}`,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg", "image/jpg"];
        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-bezkoder-${file.originalname}`;
            return filename;
        }
        return {
            bucketName: "photos",
            filename: `${Date.now()}-bezkoder-${file.originalname}`
        };
    }
});
const uploadFile = multer_1.default({ storage: storage }).single("image");
const uploadFilesMiddleware = util_1.default.promisify(uploadFile);
exports.default = uploadFilesMiddleware;
