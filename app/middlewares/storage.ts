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
            const filename = `${Date.now()}-bezkoder-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: "photos",
            filename: `${Date.now()}-bezkoder-${file.originalname}`
        };
    }
});

const uploadFile = multer({ storage: storage }).single("image");
const uploadFilesMiddleware = util.promisify(uploadFile);
export default uploadFilesMiddleware;