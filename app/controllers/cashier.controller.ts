import { Request, Response, NextFunction } from 'express'
import { Product } from '../models/Product.model'
import { Cart } from '../models/Cart.model'

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
        const getBrandName = getProduct?.brand_name;
        const getProductName = getProduct?.product_name;
        const getUom = getProduct?.uom;
        const getSellPrice = getProduct?.sellPrice;
        const getIsAfterTax = getProduct?.isAfterTax;
        const getStock = getProduct?.stock;
        const item: string = getBrandName + "_" + getProductName + "_" + getUom;

        let countTax: number;
        let quantity: number;

        (!inputQuantity || inputQuantity == 0) ? quantity = 1 : quantity = inputQuantity;
        (getIsAfterTax == "no") ? countTax = getSellPrice * 10 / 100 : countTax = 0;

        let createItem: any;
        const countStock: number = getStock - quantity;
        let updateStockData: object;
        (countStock <= 10) ? updateStockData = { $inc: { stock: -quantity }, status: "inactive" } : updateStockData = { $inc: { stock: -quantity } };
        let updateStock: any;

        try {
            const totalPrice: number = getSellPrice * quantity;
            const totalTax: number = countTax * quantity;
            if (getProduct.status == "inactive") {
                res.status(500).json({ success: false, message: "Product Inactive: Produk ini tidak dijual" })
            } else {
                createItem = await Cart.create({
                    admin_id: getUserId,
                    item: item,
                    quantity: quantity,
                    price: getSellPrice,
                    totalTax: totalTax,
                    totalPrice: totalPrice,
                })
            }
        }
        catch (err) {
            next(err)
        }
        finally {
            updateStock = await Product.findOneAndUpdate({ barcode: inputBarcode }, updateStockData, { new: true })
            res.status(201).json({ success: true, message: "product added to cart", data: createItem })
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
        const item: string = getBrandName + "_" + getProductName + "_" + getUom;

        let countTax: number;
        let quantity: number;

        (!inputQuantity || inputQuantity == 0) ? quantity = 1 : quantity = inputQuantity;
        (getIsAfterTax == "no") ? countTax = getSellPrice * 10 / 100 : countTax = 0;

        let createItem: any;
        const countStock: number = getStock - quantity;
        let updateStockData: object;
        (countStock <= 10) ? updateStockData = { $inc: { stock: -quantity }, status: "inactive" } : updateStockData = { $inc: { stock: -quantity } };
        let updateStock: any;

        try {
            const totalPrice: number = getSellPrice * quantity;
            const totalTax: number = countTax * quantity;
            if (getProduct.status == "inactive") {
                res.status(500).json({ success: false, message: "Product Inactive: Produk ini tidak dijual" })
            } else {
                createItem = await Cart.create({
                    admin_id: getUserId,
                    item: item,
                    quantity: quantity,
                    price: getSellPrice,
                    totalTax: totalTax,
                    totalPrice: totalPrice,
                })
            }
        }
        catch (err) {
            next(err)
        }
        finally {
            updateStock = await Product.findByIdAndUpdate(inputProductId, updateStockData, { new: true })
            res.status(201).json({ success: true, message: "product added to cart", data: createItem })
        }
    }
    static listCart(req: Request, res: Response, next: NextFunction) {
        Cart.find({ status: "ok" })
            .then((result) => {
                res.status(200).json({ success: true, message: "Cart items: ", data: result })
            })
            .catch((err) => {
                res.sendStatus(404)
            })
    }
    static cancelItem(req: Request, res: Response, next: NextFunction) {

    }
    static checkOut(req: Request, res: Response, next: NextFunction) {

    }
}

export default cashierController