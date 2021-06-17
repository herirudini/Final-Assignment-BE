// import fs from 'fs';

// export default function converter64(file: any) {
//         const binary = fs.readFileSync(file);
//         return new Buffer(binary).toString('base64')
// }

// import util from 'util';
// import multer from 'multer';
// const GridFsStorage = require("multer-gridfs-storage");
// const mongoURI: string = process.env.DATABASE as string;

// const storage = new GridFsStorage({
//         url: `${mongoURI}`,
//         options: { useNewUrlParser: true, useUnifiedTopology: true },
//         file: (req: any, file: any) => {
//                 const match = ["image/png", "image/jpeg", "image/jpg"];

//                 if (match.indexOf(file.mimetype) === -1) {
//                         const filename = `${Date.now()}-acongkelontong-${file.originalname}`;
//                         return filename;
//                 }

//                 return {
//                         bucketName: "photos",
//                         filename: `${Date.now()}-acongkelontong-${file.originalname}`
//                 };
//         }
// });
// const uploadImage = util.promisify(multer({ storage: storage }).single("image"))
// module.exports = uploadImage;


// import { Request, Response, NextFunction } from 'express'
// const GridFsStorage = require('multer-gridfs-storage')
// const grid = GridFsStorage()

// import util from 'util'
// import multer from 'multer'

// module.exports = () => {
//     const mongoURI: string = process.env.DATABASE as string;
//     const originUrl = location.origin

//     // const diskStorage = multer.diskStorage({
//     const storage = new GridFsStorage({
//         url: `mongodb+srv://rudini1994:rudini1994@cluster0.pxg2u.mongodb.net/ass4(POS)?retryWrites=true&w=majority`,
//         options: { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },
//         file: (req: any, file: any) => {
//             const match = ["image/png", "image/jpeg"];

//             if (match.indexOf(file.mimetype) === -1) {
//                 const filename = `${originUrl}/uploads/${Date.now()}"-"${file.originalname}`;
//                 return filename;
//             }

//             return {
//                 bucketName: "photos",
//                 filename: `${originUrl}/uploads/${Date.now()}"-"${file.originalname}`
//             };
//         }
//     });
//     multer({ storage }).single("image")
// }


// var uploadFile = multer({ storage: storage }).single("file");
// var uploadFilesMiddleware = util.promisify(uploadFile);
// module.exports = uploadFilesMiddleware;
// destination: (req, file, cb) => {
//     cb(null, 'uploads');
// },
// filename: (req, file, cb) => {
//     const mimeType = file.mimetype.split('/');
//     const fileType = mimeType[1];
//     const originUrl = location.origin
//     const fileName = originUrl + file.fieldname + '.' + fileType;
//     console.log("filename")
//     cb(null, fileName);
// },


// const fileFilter = (req: any, file: any, cb: any) => {
//     const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
//     allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
// };

// export default function uploadFiles() {
// upload
// util.promisify()


// console.log("masuk multer")
// console.log("lewat multer")
// next()
// }

// console.log("multer", multer({ storage: diskStorage, fileFilter: fileFilter }).single("image"))




// const uploadFile = multer({ storage: storage });
// export default uploadFile;


// ININININININI

// const storage = multer.diskStorage({
//     destination: './public/img',
//     filename: (req, file, callBack) => {
//         callBack(null, 'product' + '-' + Date.now() + path.extname(file.originalname));
//     }
// })

// const upload = multer({ storage: storage }).single('imageProduct')

// upload(req, res, async (error:any) => {
//     if (error) {
//     throw { name: "Failed Upload Image" };
//     } else {
//     const hostname = req.headers.host;
//     const imageURL = 'http://' + hostname + '/' + req.file.path
//     const uploadedImage = await ProductModel.findByIdAndUpdate(productID, {
//     image: imageURL
//     }, { new: true })

//     res.status(201).json({
//     success: true,
//     statusCode: 201,
//     responseStatus: "Status OK",
//     message: `Upload Image`,
//     data: uploadedImage,
//     imageURL: imageURL
//     });
//     }
//     }) 

// ANANANANANNAN
// const multer = require("multer");
// const MIME_TYPE_MAP = { "image/png": "png", "image/jpeg": "jpg", "image/jpg": "jpg", };
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const isValid = MIME_TYPE_MAP[file.mimetype]; let error = new Error("Invalid mime type");
//         if (isValid) { error = null; } cb(error, __basedir + "/image/");
//     }, filename: (req, file, cb) => {
//         const name = file.originalname.toLowerCase().split(" ").join("-");
//         const ext = MIME_TYPE_MAP[file.mimetype]; 
        // cb(null, name + "-" + Date.now() + "." + ext); // cb(null, name + "." + ext); cb(null, name); }, }); 