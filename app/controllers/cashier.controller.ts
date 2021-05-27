import { Request, Response, NextFunction } from 'express'
import { Product } from '../models/Product.model'
import { Cart } from '../models/Cart.model'
import { Receipt } from '../models/Receipt.model'

class cashierController {
    static getAllProduct(req: Request, res: Response, next: NextFunction) {
        Product.find({ status: "active" })
            .then((result) => {
                res.status(200).json({ success: true, message: "All Product: ", data: result })
            })
            .catch((err) => {
                next(err)
            })
    }
    static async addToCart(req: Request, res: Response, next: NextFunction) {
        const inputBarcode = req.body.barcode;
        const inputQuantity = req.body.quantity
        const getUserId = (<any>req).user_id;
        const getProduct: any = await Product.findOne({ barcode: inputBarcode });
        const getProductId = getProduct?.id;
        const getBrandName = getProduct?.brand_name;
        const getProductName = getProduct?.product_name;
        const getUom = getProduct?.uom;
        const getSellPrice = getProduct?.sellPrice;
        const getIsAfterTax = getProduct?.isAfterTax;
        const getStock = getProduct?.stock;
        const checkCart: any = await Cart.countDocuments({ status: "on-process", product_id: getProductId, admin_id: getUserId });

        let countTax: number;
        let quantity: number;

        (!inputQuantity || inputQuantity == 0) ? quantity = 1 : quantity = inputQuantity;
        (getIsAfterTax == "no") ? countTax = getSellPrice * 10 / 100 : countTax = 0;

        let createCart: any;
        let updateCart: any;

        const countStock: number = getStock - quantity;
        let updateStockData: object;
        (countStock <= 10) ? updateStockData = { $inc: { stock: -quantity }, status: "inactive" } : updateStockData = { $inc: { stock: -quantity } };
        let updateStock: any;

        try {
            const totalPrice: number = getSellPrice * quantity;
            const tax: number = countTax * quantity;
            if (getProduct.status == "inactive") {
                res.status(500).json({ success: false, message: "Product Inactive: Produk ini tidak dijual" })
            } else if (checkCart == 0) {
                createCart = await Cart.create({
                    admin_id: getUserId,
                    brand_name: getBrandName,
                    product_name: getProductName,
                    uom: getUom,
                    product_id: getProductId,
                    quantity: quantity,
                    price: getSellPrice,
                    tax: tax,
                    totalPrice: totalPrice,
                })
            } else {
                updateCart = await Cart.findOneAndUpdate({ status: "on-process", product_id: getProductId, admin_id: getUserId }, { $inc: { quantity: quantity } }, { new: true })
            }
        }
        catch (err) {
            next(err)
        }
        finally {
            updateStock = await Product.findOneAndUpdate({ barcode: inputBarcode }, updateStockData, { new: true })
            res.status(201).json({ success: true, message: "product added to cart", data: createCart })
        }
    }
    static async addToCartManual(req: Request, res: Response, next: NextFunction) {
        const inputProductId = req.params.product_id;
        const inputQuantity = req.body.quantity
        const getUserId = (<any>req).user_id;
        const getProduct: any = await Product.findById(inputProductId);
        const getBrandName = getProduct?.brand_name;
        const getProductName = getProduct?.product_name;
        const getUom = getProduct?.uom;
        const getSellPrice = getProduct?.sellPrice;
        const getIsAfterTax = getProduct?.isAfterTax;
        const getStock = getProduct?.stock;
        const checkCart: any = await Cart.countDocuments({ status: "on-process", product_id: inputProductId, admin_id: getUserId });

        let countTax: number;
        let quantity: number;

        (!inputQuantity || inputQuantity == 0) ? quantity = 1 : quantity = inputQuantity;
        (getIsAfterTax == "no") ? countTax = getSellPrice * 10 / 100 : countTax = 0;

        let createCart: any;
        let updateCart: any;

        const countStock: number = getStock - quantity;
        let updateStockData: object;
        (countStock <= 10) ? updateStockData = { $inc: { stock: -quantity }, status: "inactive" } : updateStockData = { $inc: { stock: -quantity } };
        let updateStock: any;

        try {
            const totalPrice: number = getSellPrice * quantity;
            const tax: number = countTax * quantity;
            if (getProduct.status == "inactive") {
                res.status(500).json({ success: false, message: "Product Inactive: Produk ini tidak dijual" })
            } else if (checkCart == 0) {
                createCart = await Cart.create({
                    admin_id: getUserId,
                    product_id: inputProductId,
                    brand_name: getBrandName,
                    product_name: getProductName,
                    uom: getUom,
                    quantity: quantity,
                    price: getSellPrice,
                    tax: tax,
                    totalPrice: totalPrice,
                })
            } else {
                updateCart = await Cart.findOneAndUpdate({ status: "on-process", product_id: inputProductId, admin_id: getUserId }, { $inc: { quantity: quantity } }, { new: true })
            }
        }
        catch (err) {
            next(err)
        }
        finally {
            updateStock = await Product.findByIdAndUpdate(inputProductId, updateStockData, { new: true })
            res.status(201).json({ success: true, message: "product added to cart", data: createCart })
        }
    }
    static listCart(req: Request, res: Response, next: NextFunction) {
        Cart.find({ status: "on-process" })
            .then((result) => {
                res.status(200).json({ success: true, message: "Cart items: ", data: result })
            })
            .catch((err) => {
                res.sendStatus(404)
            })
    }
    static async cancelItem(req: Request, res: Response, next: NextFunction) {
        const cart_id = req.params.cart_id;
        const inputNotes = req.body.notes;
        const getCart: any = await Cart.findById(cart_id);
        const getQuantity: number = getCart?.quantity;
        const getProductId: number = getCart?.product_id;
        let updateStatus: any;
        let updateProductStock: any;
        try {
            updateStatus = await Cart.findByIdAndUpdate(cart_id, { status: "cancel", notes: inputNotes }, { new: true });
            updateProductStock = await Product.findByIdAndUpdate(getProductId, { $inc: { quantity: -getQuantity } }, { new: true })
        }
        catch (err) {
            console.log(err)
            next(err)
        }
        finally {
            next()
        }
    }
    static async checkOut(req: Request, res: Response, next: NextFunction) {
        const getUserId: string = (<any>req).user_id;
        const getCart: any = await Cart.find({ status: "on-process", admin_id: getUserId });
        const items: any = await Cart.find({ status: "on-process", admin_id: getUserId }).select('-status -admin_id -product_id -date')
        let totalTax: number = 0;
        let totalPrice: number = 0;
        let subtotal = totalPrice + totalTax
        let createReceipt: any;
        let updateStatus: any;

        try {
            for (let i in getCart) {
                totalPrice += getCart[i].totalPrice;
                totalTax += getCart[i].tax;
            };
            createReceipt = await Receipt.create({
                items: items,
                totalTax: totalTax,
                subtotal: subtotal,
            })
        }
        catch (err) {
            console.log("err checkout controller:" + err)
            next(err)
        }
        finally {
            updateStatus = await Cart.updateMany({ status: "on-process", admin_id: getUserId }, { $set: { status: "sold" } });
            next()
        }
    }
}

export default cashierController