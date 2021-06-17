import { Request, Response, NextFunction } from 'express'
import util from 'util'
import multer from 'multer'
const mongoURI: string = process.env.DATABASE as string;

const GridFsStorage = require('multer-gridfs-storage')
const storage = new GridFsStorage({
    url: `${mongoURI}`,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req: any, file: any) => {
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

const uploadFile = multer({ storage: storage });
// const uploadFilesMiddleware = util.promisify(uploadFile);
export default uploadFile;