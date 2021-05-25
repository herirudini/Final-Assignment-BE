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
        const inputBrands = req.body.brands;
        const inputAddress = req.body.address;
        let createSuplier;
        try {
            createSuplier = await Suplier.create({
                suplier_name: inputSuplierName,
                contact: inputContact,
                address: inputAddress,
                brands: inputBrands
            })
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(201).json({ success: true, message: "Suplier created", data: createSuplier })
        }
    }

    static async createProduct(req: Request, res: Response, next: NextFunction) {
        const inputSuplierName = req.body.suplier_name.toUpperCase();
        const inputBrandName = req.body.brand_name.toUpperCase();
        const inputProductName = req.body.product_name.toUpperCase();
        const inputImage = req.body.image;
        const inputUom = req.body.uom;
        const inputSellPrice = req.body.sellPrice;
        const inputBarcode = req.body.barcode;
        const inputBuyPrice = req.body.buyPrice;
        const inputIsAfterTax = req.body.isAfterTax;

        const getSuplier = await Suplier.findOne({ suplier_name: inputSuplierName });
        const getSuplierId = getSuplier?.id;
        const checkBrands = getSuplier?.brands;
        let brandIsExist: boolean | undefined = checkBrands?.includes(inputBrandName);
        let pushBrand: any;

        let createProduct: any;
        try {
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
            if (!brandIsExist) {
                pushBrand = await Suplier.findByIdAndUpdate(getSuplierId, { $push: { brands: inputBrandName } }, { new: true })
            };
        }
        catch (err) {
            next(err)
        }
        finally {
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

        try {
            if (checkOrder !== 0) {
                const listOnProcessOrder = await Order.find({ suplier_id: getSuplierId, product_id: getProductId, status: "on-process" })
                res.status(500).json({ success: false, message: "You have an unfinished order, you can force this by edit previous order status first into: force-complete", data: listOnProcessOrder })
            }
            createOrder = await Order.create({
                suplier_id: getSuplierId,
                product_id: getProductId,
                brand_name: getBrandName,
                uom: getUom,
                buyPrice: getBuyPrice,
                discount: inputDiscount,
                quantity: inputQuantity,
                subTotal: countSubTotal,
                isAfterTax: getIsAfterTax,
            });
        }
        catch (err) {
            next(err)
        }
        finally {
            if (checkInvoice == 0) {
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

    static getAllProduct(req: Request, res: Response, next: NextFunction) {
        Product.find()
            .then((result) => {
                res.status(200).json({ success: true, message: "All Product:", data: result })
            })
            .catch((err) => {
                next(err)
            })
    }

    static setProductStatus(req: Request, res: Response, next: NextFunction) {
        const inputStatus = req.body.status
        Product.findById(req.params.product_id, { status: inputStatus }, { new: true })
            .then((result) => {
                res.status(200).json({ success: true, message: "Product status updated:", data: result })
            })
            .catch((err) => {
                next(err)
            })
    }
}

export default inventoryController