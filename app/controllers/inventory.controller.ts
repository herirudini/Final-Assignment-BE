import { Request, Response, NextFunction } from 'express'
import { Order } from '../models/Order.model'
import { Brand } from '../models/Brand.model'
import { Suplier } from '../models/Suplier.model'
import { Product } from '../models/Product.model'
import { Delivery } from '../models/Delivery.model'


class inventoryController {
    static async createBrand(req: Request, res: Response, next: NextFunction) {
        const inputName = req.body.name;
        const inputProducts = req.body.products;
        let createBrand;
        try {
            createBrand = await Brand.create({
                name: inputName,
                products: inputProducts,
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
        const inputBrand = req.body.brand_id;
        const inputName = req.body.name;
        const inputImage = req.body.image;
        const inputUom = req.body.uom;
        const inputSellPrice = req.body.sellPrice;
        const inputBarcode = req.body.barcode

        let createProduct;
        try {
            createProduct = await Order.create({
                brand_id: inputBrand,
                name: inputName,
                image: inputImage,
                uom: inputUom,
                sellPrice: inputSellPrice,
                barcode: inputBarcode,
            })
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(201).json({ success: true, message: "Product created", data: createProduct })
        }
    }
    static async createSuplier(req: Request, res: Response, next: NextFunction) {
        const inputName = req.body.name;
        const inputContact = req.body.contact;
        let createSuplier;
        try {
            createSuplier = await Suplier.create({
                name: inputName,
                contact: inputContact,
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
        const inputSuplier = req.body.suplier_id;
        const inputBrand = req.body.brand_id;
        const inputProduct = req.body.product_id;
        const inputUom = req.body.uom;
        const inputQuantity = req.body.quantity;

        let createOrder;
        try {
            createOrder = await Order.create({
                suplier_id: inputSuplier,
                brand_id: inputBrand,
                product_id: inputProduct,
                uom: inputUom,
                quantity: inputQuantity,
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
        const order_id = req.params.order_id;
        const order = await Order.findById(order_id);
        const product_id = order?.product_id;
        const quantity = order?.quantity;
        const arrived = order?.arrived;
        const buyPrice = order?.buyPrice;
        const isAfterTax = order?.isAfterTax;
        const discount = order?.discount;
        const checkProduct = await Product.countDocuments({ product_id });
        const tryMatchQuantity = arrived + inputArrivedQuantity;

        let createDelivery;
        let updateProduct;
        let updateOrderData;
        let updateOrder;
        (tryMatchQuantity === quantity) ? updateOrderData = { $inc: { arrived: inputArrivedQuantity }, status: "finish" } : { $inc: { arrived: inputArrivedQuantity } }

        try {
            createDelivery = await Delivery.create({
                order_id: order_id,
                arrivedQuantity: inputArrivedQuantity,
            });
            updateProduct = await Product.findByIdAndUpdate(product_id, { $inc: { stock: inputArrivedQuantity }, buyPrice: buyPrice, isAfterTax: isAfterTax }, { new: true });
            updateOrder = await Order.findByIdAndUpdate(order_id, updateOrderData, { new: true });
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