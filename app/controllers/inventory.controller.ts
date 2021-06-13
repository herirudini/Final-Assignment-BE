import { Request, Response, NextFunction } from 'express'
import { Order } from '../models/Order.model'
import { Suplier } from '../models/Suplier.model'
import { Product } from '../models/Product.model'
import { Delivery } from '../models/Delivery.model'
import { Invoice } from '../models/Invoice.model'
// import fs from 'fs'
// import path from 'path'
// import uploadFilesMiddleware from '../middlewares/storage'


class inventoryController {
    static async createSuplier(req: Request, res: Response, next: NextFunction) {
        const inputSuplierName = req.body.suplier_name.toUpperCase();
        const inputContact = req.body.contact;
        const inputAddress = req.body.address;
        let createSuplier;
        try {
            createSuplier = await Suplier.create({
                suplier_name: inputSuplierName,
                contact: inputContact,
                address: inputAddress,
            })
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(201).json({ success: true, message: "Suplier created", data: createSuplier })
        }
    }
    static listSuplier(req: Request, res: Response, next: NextFunction) {
        Suplier.find()
            .then((result) => {
                res.status(200).json({ success: true, message: "Suplier list:", data: result })
            })
            .catch((err) => {
                next(err)
            })
    }
    static async listBrandBySuplierName(req: Request, res: Response, next: NextFunction) {
        const inputSuplierName: string = req.body.suplier_name.toUpperCase();
        const listBrandName: any = await Suplier.findOne({ suplier_name: inputSuplierName }).select('brands -_id');
        try {
            res.status(200).json({ success: true, message: "brand list", data: listBrandName })
        }
        catch (err) {
            next(err)
        }
    }
    static async listProductAndUomByBrandName(req: Request, res: Response, next: NextFunction) {
        const inputBrandName: string = req.body.brand_name.toUpperCase();
        const listProductName: any = await Product.aggregate([
            { $match: { brand_name: inputBrandName } },
            { $group: { _id: '$product_name' } },
        ]);
        const listUom: any = await Product.aggregate([
            { $match: { brand_name: inputBrandName } },
            { $group: { _id: '$uom' } },
        ]);

        try {
            let getProductName = [];
            let getUom = [];
            for (let i = 0; i < listProductName.length; i++) {
                getProductName.push(listProductName[i]._id)
            };
            for (let i = 0; i < listUom.length; i++) {
                getUom.push(listUom[i]._id)
            };
            let data = { product_name: getProductName, uom: getUom }
            res.status(200).json({ success: true, message: "product and uom", data: data })
        }
        catch (err) {
            next(err)
        }
    }
    static async createProduct(req: Request, res: Response, next: NextFunction) {
        // await uploadFilesMiddleware(req, res);
        const inputSuplierName: string = req.body.suplier_name.toUpperCase();
        const inputBrandName: string = req.body.brand_name.toUpperCase();
        const inputProductName: string = req.body.product_name.toUpperCase();
        const inputUom = req.body.uom.toUpperCase();
        const inputImage = req.body.image
        const inputSellPrice = req.body.sellPrice;
        const inputBarcode = req.body.barcode;
        const inputBuyPrice = req.body.buyPrice;
        const inputIsAfterTax = req.body.isAfterTax.toLowerCase();
        const checkProduct = await Product.countDocuments({ brand_name: inputBrandName, product_name: inputProductName, uom: inputUom })

        const getSuplier = await Suplier.findOne({ suplier_name: inputSuplierName });
        const getSuplierName = getSuplier?.id;
        const checkBrands = getSuplier?.brands;
        let brandIsExist: boolean | undefined = checkBrands?.includes(inputBrandName);
        let pushBrand: any;

        let createProduct: any;
        try {
            // if (req.file == undefined) {
            //     res.status(422).json({ success: false, message: "Image not detected" })
            // } else
            if (getSuplierName === undefined) {
                res.status(422).json({ success: false, message: "Suplier not found" })
            } else if (checkProduct === 0) {
                createProduct = await Product.create({
                    suplier_name: inputSuplierName,
                    brand_name: inputBrandName,
                    product_name: inputProductName,
                    image: inputImage,
                    uom: inputUom,
                    buyPrice: inputBuyPrice,
                    sellPrice: inputSellPrice,
                    isAfterTax: inputIsAfterTax,
                    barcode: inputBarcode,
                });
            } else {
                res.status(400).json({ success: false, message: "This product already exists! cannot be the same" })
            }
        }
        catch (err) {
            next(err)
        }
        finally {
            if (!brandIsExist) {
                pushBrand = await Suplier.findByIdAndUpdate(getSuplierName, { $push: { brands: inputBrandName } }, { new: true })
            };
            res.status(201).json({ success: true, message: "Product created", data: createProduct })
        }
    }

    static async purchaseOrder(req: Request, res: Response, next: NextFunction) {
        const inputBarcode = req.body.barcode;
        const inputDiscount = req.body.discount;
        const inputQuantity = req.body.quantity;

        const getProduct: any = await Product.findOne({ barcode: inputBarcode });
        const getProductName: string = getProduct?.product_name;
        const getBrandName: string = getProduct?.brand_name;
        const getSuplierName: string = getProduct?.suplier_name;
        const getUom = getProduct?.uom;
        const getBuyPrice = getProduct?.buyPrice;
        const getIsAfterTax = getProduct?.isAfterTax;
        const getProductId = getProduct?.id;

        const countDiscount = getBuyPrice * (inputDiscount / 100);
        const countTotalBuyPrice = getBuyPrice - countDiscount;
        const countSubTotal = countTotalBuyPrice * inputQuantity

        const checkOrder = await Order.countDocuments({ suplier_name: getSuplierName, product_id: getProductId, status: "on-process" });
        const checkInvoice = await Invoice.countDocuments({ suplier_name: getSuplierName, status: "unpaid" })
        let createOrder: any;
        let createInvoice: any;
        let updateInvoice: any;
        let discount: number;
        (!inputDiscount) ? discount = 0 : discount = inputDiscount;

        try {
            if (checkOrder !== 0) {
                const getOrder = await Order.findOne({ suplier_name: getSuplierName, product_id: getProductId, status: "on-process" })
                res.status(422).json({ success: false, message: "You have an unfinished order, you can force this by edit previous order status first into: force-complete", data: getOrder })
            } else {
                createOrder = await Order.create({
                    suplier_name: getSuplierName,
                    product_id: getProductId,
                    product_name: getProductName,
                    brand_name: getBrandName,
                    uom: getUom,
                    buyPrice: getBuyPrice,
                    discount: discount,
                    quantity: inputQuantity,
                    subTotal: countSubTotal,
                    isAfterTax: getIsAfterTax,
                });
            }
        }
        catch (err) {
            next(err)
        }
        finally {
            if (createOrder.id === undefined) {
                console.log("Failed to create order")
            } else if (checkInvoice == 0) {
                createInvoice = await Invoice.create({
                    suplier_name: getSuplierName,
                    orders: createOrder.id,
                    bill: countSubTotal,
                })
            } else {
                updateInvoice = await Invoice.findOneAndUpdate({ suplier_name: getSuplierName, status: "unpaid" }, { $push: { orders: createOrder.id }, $inc: { bill: countSubTotal } }, { new: true })
            };
            res.status(201).json({ success: true, message: "Order created", data: createOrder })
        }
    }

    static async deliveryOrder(req: Request, res: Response, next: NextFunction) {
        const inputArrivedQuantity = req.body.arrivedQuantity;
        const inputBarcode = req.body.barcode;
        const getUserId = (<any>req).user_id;
        const getProduct = await Product.findOne({ barcode: inputBarcode })
        const getProductId = getProduct?.id;
        const getSuplierName = getProduct?.suplier_name;
        const checkOrder: any = await Order.countDocuments({ suplier_name: getSuplierName, product_id: getProductId, status: "on-process" });
        const getOrder: any = await Order.findOne({ suplier_name: getSuplierName, product_id: getProductId, status: "on-process" });
        const getOrderId = getOrder?.id;
        const getQuantity: any = getOrder?.quantity;
        const arrived: number | undefined = getOrder?.arrived;
        const tryMatchQuantity: number = arrived + inputArrivedQuantity - getQuantity;

        let updateOrder: any;
        let createDelivery: any;
        let updateProduct: any;

        try {
            if (checkOrder == 0) {
                res.status(404).json({ success: false, message: "there is no on-process order on this product" })
            } else if (tryMatchQuantity > 0) {
                res.status(422).json({ success: false, message: "Wrong input arrived quanitity, count carefully", data: getOrder })
            } else if (tryMatchQuantity == 0) {
                updateOrder = await Order.findByIdAndUpdate(getOrderId, { $inc: { arrived: inputArrivedQuantity }, status: "complete" }, { new: true });
            } else {
                updateOrder = await Order.findByIdAndUpdate(getOrderId, { $inc: { arrived: inputArrivedQuantity } }, { new: true });
            };
            createDelivery = await Delivery.create({
                order_id: getOrderId,
                arrivedQuantity: inputArrivedQuantity,
                admin_id: getUserId
            });
            updateProduct = await Product.findByIdAndUpdate(getProductId, { $inc: { stock: inputArrivedQuantity } }, { new: true });
            res.status(201).json({ success: true, message: "Delivery created, Order updated, Product updated", data: createDelivery });
        }
        catch (err) {
            console.log("inventory_controller_err: " + err)
            next(err)
        }
    }
    static getAllProduct(req: Request, res: Response, next: NextFunction) {
        Product.find()
            .then((result) => {
                res.status(200).json({ success: true, message: "All Products:", data: result })
            })
            .catch((err) => {
                next(err)
            })
    }
    static searchProduct(req: Request, res: Response, next: NextFunction) {
        const keywords: string = req.body.keywords;
        const brand_name: string = req.body.brand_name.toUpperCase();

        Product.find({ brand_name: brand_name, $text: { $search: keywords } },
            { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } })
            .then((result) => {
                res.status(200).json({ success: true, message: "Product found: ", data: result })
            })
            .catch((err) => {
                next(err)
            })
    }
    static async setProductStatus(req: Request, res: Response, next: NextFunction) {
        const inputStatus = req.body.status;
        const getProduct = await Product.findById(req.params.product_id);
        let newStatus: string;
        let updateStatus: any;
        try {
            if (inputStatus === "active") {
                newStatus = "inactive"
            } else {
                newStatus = "active"
            };
            updateStatus = await Product.findByIdAndUpdate(req.params.product_id, { status: newStatus }, { new: true });
            res.status(200).json({ success: true, message: `Succes set status: ${newStatus}`, data: updateStatus })
        }
        catch (err) {
            next(err)
        }
        // finally {
        //     console.log("Success set product status")
        //     next()
        // }
    }
    static async editProduct(req: Request, res: Response, next: NextFunction) {
        const productId: string = req.params.product_id;
        const inputBrandName = req.body.brand_name
        const inputProductName = req.body.product_name;
        const inputImage = req.body.image;
        const inputUom = req.body.uom;
        const inputSellPrice = req.body.sellPrice;
        const inputBuyPrice = req.body.buyPrice;

        try {
            const data: any = { brand_name: inputBrandName, product_name: inputProductName, image: inputImage, uom: inputUom, sellPrice: inputSellPrice, buyPrice: inputBuyPrice };

            for (const key in data) {
                if (!data[key]) {
                    delete data[key]
                }
            }
            let updateProduct: any = await Product.findByIdAndUpdate(productId, data, { new: false })
            const checkProduct = await Product.countDocuments({ id: { $ne: updateProduct.id }, brand_name: updateProduct.brand_name, product_name: updateProduct.product_name, uom: updateProduct.uom });
            if (checkProduct == 0) {
                updateProduct.new = true;
                res.status(200).json({ success: true, message: "Product edited", data: updateProduct })
            } else {
                res.status(400).json({ success: false, message: "This product already exists! cannot be the same" })
            }
        }
        catch (err) {
            console.log("edit product err:" + err)
            next(err)
        }
        // finally {
        //     console.log("Success edit product")
        //     res.status(200).json({ success: true, message: "Product edited", data: updateProduct })
        // }
    }
}

export default inventoryController