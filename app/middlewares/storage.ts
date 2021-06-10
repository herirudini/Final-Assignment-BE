import { Request, Response, NextFunction } from 'express'
import multer from 'multer'

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const mimeType = file.mimetype.split('/');
        const fileType = mimeType[1];
        const fileName = file.originalname + '.' + fileType;
        cb(null, fileName);
    },
});

const fileFilter = (req: any, file: any, cb: any) => {
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

export default multer({ storage: diskStorage, fileFilter: fileFilter }).single('image');