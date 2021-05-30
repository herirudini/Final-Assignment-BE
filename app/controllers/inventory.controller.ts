import { Request, Response, NextFunction } from 'express'
import { Order } from '../models/Order.model'
import { Suplier } from '../models/Suplier.model'
import { Product } from '../models/Product.model'
import { Delivery } from '../models/Delivery.model'
import { Invoice } from '../models/Invoice.model'



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
    static async listNames(req: Request, res: Response, next: NextFunction) {
        const listBrandName: any = await Product.aggregate([
            { $match: {} },
            { $group: { _id: '$brand_name', total: { $sum: '$stock' } } },
        ]);
        const listProductName: any = await Product.aggregate([
            { $match: {} },
            { $group: { _id: '$product_name', total: { $sum: '$stock' } } },
        ]);
        const listUom: any = await Product.aggregate([
            { $match: {} },
            { $group: { _id: '$uom', total: { $sum: '$stock' } } },
        ]);
        try {
            let getBrandName = [];
            let getProductName = [];
            let getUom = [];
            for (let i = 0; i < listBrandName.length; i++) {
                getBrandName.push(listBrandName[i]._id)
            };
            for (let i = 0; i < listProductName.length; i++) {
                getProductName.push(listProductName[i]._id)
            };
            for (let i = 0; i < listUom.length; i++) {
                getUom.push(listUom[i]._id)
            };
            let data = { brand_name: getBrandName, product_name: getProductName, uom: getUom }
            res.status(200).json({ success: true, message: "brand_name, product_name, uom", data: data })

        }
        catch (err) {
            next(err)
        }
    }
    static async createProduct(req: Request, res: Response, next: NextFunction) {
        const inputSuplierName = req.body.suplier_name.toUpperCase();
        const inputBrandName = req.body.brand_name.toUpperCase();
        const inputProductName = req.body.product_name.toUpperCase();
        const inputImage = req.body.image;
        const inputUom = req.body.uom.toUpperCase();
        const inputSellPrice = req.body.sellPrice;
        const inputBarcode = req.body.barcode;
        const inputBuyPrice = req.body.buyPrice;
        const inputIsAfterTax = req.body.isAfterTax.toLowerCase();
        const checkProduct = await Product.countDocuments({ brand_name: inputBrandName, product_name: inputProductName, uom: inputUom })

        const getSuplier = await Suplier.findOne({ suplier_name: inputSuplierName });
        const getSuplierId = getSuplier?.id;
        const checkBrands = getSuplier?.brands;
        let brandIsExist: boolean | undefined = checkBrands?.includes(inputBrandName);
        let pushBrand: any;

        let createProduct: any;
        try {
            if (getSuplierId === undefined) {
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
                res.status(400).json({ success: false, message: "This product has already created! cannot create more than one" })
            }
        }
        catch (err) {
            next(err)
        }
        finally {
            if (!brandIsExist) {
                pushBrand = await Suplier.findByIdAndUpdate(getSuplierId, { $push: { brands: inputBrandName } }, { new: true })
            };
            res.status(201).json({ success: true, message: "Product created", data: createProduct })
        }
    }

    static async purchaseOrder(req: Request, res: Response, next: NextFunction) {
        const inputBarcode = req.body.barcode;
        const inputDiscount = req.body.discount;
        const inputQuantity = req.body.quantity;

        const getProduct: any = await Product.findOne({ barcode: inputBarcode });
        const getBrandName: string = getProduct?.brand_name;
        const getSuplierName: string = getProduct?.suplier_name;
        const getUom = getProduct?.uom;
        const getBuyPrice = getProduct?.buyPrice;
        const getIsAfterTax = getProduct?.isAfterTax;
        const getProductId = getProduct?.id;

        const countDiscount = getBuyPrice * (inputDiscount / 100);
        const countTotalBuyPrice = getBuyPrice - countDiscount;
        const countSubTotal = countTotalBuyPrice * inputQuantity

        const getSuplier = await Suplier.findOne({ suplier_name: getSuplierName });
        const getSuplierId = getSuplier?.id;
        const checkOrder = await Order.countDocuments({ suplier_id: getSuplierId, product_id: getProductId, status: "on-process" });
        const checkInvoice = await Invoice.countDocuments({ suplier_id: getSuplierId, status: "unpaid" })
        let createOrder: any;
        let createInvoice: any;
        let updateInvoice: any;
        let discount: number;
        (!inputDiscount) ? discount = 0 : discount = inputDiscount;

        try {
            if (checkOrder !== 0) {
                const listOnProcessOrder = await Order.find({ suplier_id: getSuplierId, product_id: getProductId, status: "on-process" })
                res.status(500).json({ success: false, message: "You have an unfinished order, you can force this by edit previous order status first into: force-complete", data: listOnProcessOrder })
            } else {
                createOrder = await Order.create({
                    suplier_id: getSuplierId,
                    product_id: getProductId,
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
                    suplier_id: getSuplierId,
                    orders: createOrder.id,
                    bill: countSubTotal,
                })
            } else {
                updateInvoice = await Invoice.findOneAndUpdate({ suplier_id: getSuplierId, status: "unpaid" }, { $push: { orders: createOrder.id }, $inc: { bill: countSubTotal } }, { new: true })
            };
            res.status(201).json({ success: true, message: "Order created", data: createOrder })
        }
    }

    static async deliveryOrder(req: Request, res: Response, next: NextFunction) {
        const inputArrivedQuantity = req.body.arrivedQuantity;
        const inputBarcode = req.body.barcode;
        const getProduct = await Product.findOne({ barcode: inputBarcode })
        const getProductId = getProduct?.id;
        const getSuplierName = getProduct?.suplier_name;
        const getSuplier = await Suplier.findOne({ suplier_name: getSuplierName });
        const getSuplierId = getSuplier?.id;
        const getOrder: any = await Order.findOne({ suplier_id: getSuplierId, product_id: getProductId, status: "on-process" });
        const getOrderId = getOrder?.id;
        const getQuantity: any = getOrder?.quantity;
        const arrived: number | undefined = getOrder?.arrived;
        const tryMatchQuantity: number = arrived + inputArrivedQuantity - getQuantity;

        let createDelivery: any;
        let updateProduct: any;
        let updateOrderData: any;
        let updateOrder: any;
        if (tryMatchQuantity === 0) {
            updateOrderData = { $inc: { arrived: inputArrivedQuantity }, status: "complete" }
        } else if (tryMatchQuantity < 0) {
            updateOrderData = { $inc: { arrived: inputArrivedQuantity } }
        } else {
            res.status(400).json({ success: false, message: "Wrong input arrived quanitity, count carefully", data: getOrder })
        }

        try {
            createDelivery = await Delivery.create({
                order_id: getOrderId,
                arrivedQuantity: inputArrivedQuantity,
            });
            updateProduct = await Product.findByIdAndUpdate(getProductId, { $inc: { stock: inputArrivedQuantity } }, { new: true });
            updateOrder = await Order.findByIdAndUpdate(getOrderId, updateOrderData, { new: true });
        }
        catch (err) {
            console.log("inventory_controller_err: " + err)
            next(err)
        }
        finally {
            res.status(201).json({ success: true, message: "Delivery created, Order updated, Product updated", data: "Too Much Im Spinning" })
        }
    }
    static listProduct(req: Request, res: Response, next: NextFunction) {
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
        const getProduct = await Product.findById(req.params.product_id);
        const getProductStatus: string | undefined = getProduct?.status;
        let newStatus: string;
        let updateStatus: any;
        try {
            if (getProductStatus === "inactive") {
                newStatus = "active"
            } else {
                newStatus = "inactive"
            }
            updateStatus = await Product.findByIdAndUpdate(req.params.product_id, { status: newStatus }, { new: true })
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(200).json({ success: true, message: "Product status updated:", data: updateStatus })
        }
    }
}

export default inventoryController