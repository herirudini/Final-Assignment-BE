import { Request, Response, NextFunction } from 'express'
import { Order } from '../models/Order.model'
import { Brand } from '../models/Brand.model'
import { Suplier } from '../models/Suplier.model'
import { Product } from '../models/Product.model'
import { Delivery } from '../models/Delivery.model'


class inventoryController {
    static async createBrand(req: Request, res: Response, next: NextFunction) {
        const inputName = req.body.brandName.toUpperCase();
        let createBrand;
        try {
            createBrand = await Brand.create({
                brandName: inputName,
            })
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(201).json({ success: true, message: "Brand created", data: createBrand })
        }
    }
    static async createProduct(req: Request, res: Response, next: NextFunction) {
        const inputSuplierName = req.body.suplierName.toUpperCase()
        const inputBrandName = req.body.brandName.toUpperCase()
        const inputName = req.body.productName.toUpperCase();
        const inputImage = req.body.image;
        const inputUom = req.body.uom;
        const inputBarcode = req.body.barcode;
        const inputBuyPrice = req.body.buyPrice;
        const inputSellPrice = req.body.sellPrice;
        const countBrand = await Brand.countDocuments({ brandName: inputBrandName })
        const getSuplier = await Suplier.findOne({ suplierName: inputSuplierName })
        const suplierId = getSuplier?.id

        let brandId;
        let createBrand;
        let pushBrandId;
        let createProduct;
        let pushProductId;
        try {
            if (countBrand == 0) {
                createBrand = await Brand.create({
                    brandName: inputBrandName
                });
                brandId = createBrand.id
                pushBrandId = await Suplier.findByIdAndUpdate(suplierId, { $push: { brands: brandId } }, { new: true })
            } else {
                const getBrand = await Brand.findOne({ brandName: inputBrandName })
                brandId = getBrand?.id;
            }
        }
        catch (err) {
            next(err)
        }
        finally {
            createProduct = await Product.create({
                brand_id: brandId,
                suplier_id: suplierId,
                productName: inputName,
                image: inputImage,
                uom: inputUom,
                buyPrice: inputBuyPrice,
                sellPrice: inputSellPrice,
                barcode: inputBarcode,
            })
            pushProductId = await Brand.findByIdAndUpdate(brandId, { $push: { products: createProduct.id } }, { new: true })
            res.status(201).json({ success: true, message: "Product created", data: createProduct })
        }
    }
    static async createSuplier(req: Request, res: Response, next: NextFunction) {
        const inputName = req.body.suplierName.toUpperCase();
        const inputContact = req.body.suplierContact;
        let createSuplier;
        try {
            createSuplier = await Suplier.create({
                suplierName: inputName,
                suplierContact: inputContact,
            })
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(201).json({ success: true, message: "Suplier created", data: createSuplier })
        }
    }
    static async createOrder(req: Request, res: Response, next: NextFunction) {
        const inputBarcode = req.body.barcode;
        const inputQuantity = req.body.quantity;
        const inputDiscount = req.body.discount;
        const getProduct = await Product.findOne({ barcode: inputBarcode })
        const suplierId = getProduct?.suplier_id;
        const brandId = getProduct?.brand_id;
        const productId = getProduct?.id;
        const uom = getProduct?.uom;
        const quantity = inputQuantity;
        const discount = inputDiscount
        let createOrder;
        try {
            createOrder = await Order.create({
                suplier_id: suplierId,
                brand_id: brandId,
                product_id: productId,
                uom: uom,
                quantity: quantity,
                discount: discount,
            })
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(201).json({ success: true, message: "Order created", data: createOrder })
        }
    }
    static async confirmDelivery(req: Request, res: Response, next: NextFunction) {
        const inputArrivedQuantity = req.body.arrivedQuantity;
        const inputBarcode = req.body.barcode;
        const getProduct = await Product.findOne({ barcode: inputBarcode })
        const productId = getProduct?.id;

        const getOrder = await Order.findOne({ product_id: productId });
        const orderId = getOrder?.id;
        const quantity = getOrder?.quantity;
        const arrived = getOrder?.arrived;
        const buyPrice = getOrder?.buyPrice;
        const isAfterTax = getOrder?.isAfterTax;
        const tryMatchQuantity = arrived + inputArrivedQuantity;

        let createDelivery;
        let updateProduct;
        let updateOrderData;
        let updateOrder;
        (tryMatchQuantity === quantity) ? updateOrderData = { $inc: { arrived: inputArrivedQuantity }, status: "finish" } : { $inc: { arrived: inputArrivedQuantity } }

        try {
            createDelivery = await Delivery.create({
                order_id: orderId,
                arrivedQuantity: inputArrivedQuantity,
            });
            updateProduct = await Product.findByIdAndUpdate(productId, { $inc: { stock: inputArrivedQuantity }, buyPrice: buyPrice, isAfterTax: isAfterTax }, { new: true });
            updateOrder = await Order.findByIdAndUpdate(orderId, updateOrderData, { new: true });
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
                res.status(200).json({ success: true, message: "Product updated:", data: result })
            })
            .catch((err) => {
                next(err)
            })
    }
}

export default inventoryController