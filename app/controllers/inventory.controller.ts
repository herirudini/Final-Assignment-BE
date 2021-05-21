import { Request, Response, NextFunction } from 'express'
import { Order } from '../models/Order.model'
import { Brand } from '../models/Brand.model'
import { Suplier } from '../models/Suplier.model'
import { Invoice } from '../models/Invoice.model'
import { Product } from '../models/Product.model'
import { Delivery } from '../models/Delivery.model'


class inventoryController {
    static async createBrand(req: Request, res: Response, next: NextFunction) {
        const inputName = req.body.name;
        const inputImage = req.body.image;
        let createBrand;
        try {
            createBrand = await Brand.create({
                name: inputName,
                image: inputImage,
            })
        }
        catch (err) {
            next(err)
        }
        finally {
            res.status(201).json({ success: true, message: "Brand created", data: createBrand })
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
        const inputUom = req.body.uom;
        const inputQuantity = req.body.quantity;
        let createOrder;
        try {
            createOrder = await Order.create({
                suplier_id: inputSuplier,
                brand_id: inputBrand,
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
        const barcode = req.body.barcode;
        const inputArrivedQuantity = req.body.arrivedQuantity;
        const order_id = req.params.order_id;
        const order = await Order.findById(order_id);
        const checkProduct = await Product.countDocuments({ barcode: barcode });
        const invoice_id = order?.invoice_id;
        const brand = order?.brand_id;
        const uom = order?.uom;
        const quantity = order?.quantity;
        const arrived = order?.arrived;
        const buyPrice = order?.buyPrice;
        const sellPrice = order?.sellPrice;
        const isAfterTax = order?.isAfterTax;
        const priceTag = sellPrice;
        const billToPay = buyPrice * inputArrivedQuantity;
        const tryMatchQuantity = arrived + inputArrivedQuantity;
        let createDelivery;
        let createProduct;
        let updateProduct;
        let updateInvoice;
        let updateOrderData;
        let updateOrder;
        (tryMatchQuantity === quantity) ? updateOrderData = { $inc: { arrived: inputArrivedQuantity }, status: "finish" } : { $inc: { arrived: inputArrivedQuantity } }

        try {
            createDelivery = await Delivery.create({
                order_id: order_id,
                arrivedQuantity: inputArrivedQuantity,
            });
            updateInvoice = await Invoice.findByIdAndUpdate(invoice_id, { $inc: { paid: billToPay } }, { new: true });
            updateOrder = await Order.findByIdAndUpdate(order_id, updateOrderData, { new: true })
            if (checkProduct === 0) {
                createProduct = await Product.create({
                    brand: brand,
                    uom: uom,
                    stock: inputArrivedQuantity,
                    priceTag: priceTag,
                    isAfterTax: isAfterTax,
                    barcode: barcode
                })
            } else if (checkProduct === 1) {
                updateProduct = await Product.findOneAndUpdate({ barcode: barcode }, { $inc: { stock: inputArrivedQuantity } }, { new: true })
            } else {
                console.log("code must be buggy, 1 barcode should only for 1 product")
            }
        }
        catch (err) {
            console.log("inventory_controller_err: " + err)
            next(err)
        }
        finally {
            res.status(201).json({ success: true, message: "Delivery created, Invoice updated, Order updated, Product created or updated", data: "Too Much Im Spinning" })
        }
    }
}

export default inventoryController