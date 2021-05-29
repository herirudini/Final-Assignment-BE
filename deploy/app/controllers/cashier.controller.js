"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Product_model_1 = require("../models/Product.model");
const Cart_model_1 = require("../models/Cart.model");
const Receipt_model_1 = require("../models/Receipt.model");
const Notification_model_1 = require("../models/Notification.model");
class cashierController {
    static searchProduct(req, res) {
        const keywords = req.body.keywords;
        const filter = req.body.filter;
        Product_model_1.Product.find({ brand_name: filter, $text: { $search: keywords } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } })
            .then((result) => {
            res.status(200).json({ success: true, message: "Product found: ", data: result });
        })
            .catch((err) => {
            res.status(404).json({ success: false, message: "Product not-found", data: err });
        });
    }
    static addToCart(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputBarcode = req.body.barcode;
            const inputQuantity = req.body.quantity;
            const getUserId = req.user_id;
            const getProduct = yield Product_model_1.Product.findOne({ barcode: inputBarcode });
            const getProductId = getProduct === null || getProduct === void 0 ? void 0 : getProduct.id;
            const getBrandName = getProduct === null || getProduct === void 0 ? void 0 : getProduct.brand_name;
            const getProductName = getProduct === null || getProduct === void 0 ? void 0 : getProduct.product_name;
            const getUom = getProduct === null || getProduct === void 0 ? void 0 : getProduct.uom;
            const getSellPrice = getProduct === null || getProduct === void 0 ? void 0 : getProduct.sellPrice;
            const getIsAfterTax = getProduct === null || getProduct === void 0 ? void 0 : getProduct.isAfterTax;
            const getStock = getProduct === null || getProduct === void 0 ? void 0 : getProduct.stock;
            const checkCart = yield Cart_model_1.Cart.countDocuments({ status: "on-process", product_id: getProductId, admin_id: getUserId });
            let countTax;
            let quantity;
            (!inputQuantity || inputQuantity == 0) ? quantity = 1 : quantity = inputQuantity;
            (getIsAfterTax == "no") ? countTax = getSellPrice * 10 / 100 : countTax = 0;
            let createCart;
            let updateCart;
            const countStock = getStock - quantity;
            let createNotification;
            let updateStockData;
            let updateStock;
            try {
                const totalPrice = getSellPrice * quantity;
                const tax = countTax * quantity;
                if (getProduct.status == "inactive") {
                    res.status(500).json({ success: false, message: "Product Inactive: Produk ini tidak dijual" });
                }
                else if (checkCart == 0) {
                    createCart = yield Cart_model_1.Cart.create({
                        admin_id: getUserId,
                        brand_name: getBrandName,
                        product_name: getProductName,
                        uom: getUom,
                        product_id: getProductId,
                        quantity: quantity,
                        price: getSellPrice,
                        tax: tax,
                        totalPrice: totalPrice,
                    });
                }
                else {
                    updateCart = yield Cart_model_1.Cart.findOneAndUpdate({ status: "on-process", product_id: getProductId, admin_id: getUserId }, { $inc: { quantity: quantity } }, { new: true });
                }
            }
            catch (err) {
                next(err);
            }
            finally {
                if (countStock <= 10) {
                    createNotification = yield Notification_model_1.Notification.create({ message: getProductName + "stock is under 10! product status will be set to inactive" });
                    updateStockData = { $inc: { stock: -quantity }, status: "inactive" };
                }
                else {
                    updateStockData = { $inc: { stock: -quantity } };
                }
                ;
                updateStock = yield Product_model_1.Product.findOneAndUpdate({ barcode: inputBarcode }, updateStockData, { new: true });
                res.status(201).json({ success: true, message: "product added to cart", data: createCart });
            }
        });
    }
    static addToCartManual(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputProductId = req.params.product_id;
            const inputQuantity = req.body.quantity;
            const getUserId = req.user_id;
            const getProduct = yield Product_model_1.Product.findById(inputProductId);
            const getBrandName = getProduct === null || getProduct === void 0 ? void 0 : getProduct.brand_name;
            const getProductName = getProduct === null || getProduct === void 0 ? void 0 : getProduct.product_name;
            const getUom = getProduct === null || getProduct === void 0 ? void 0 : getProduct.uom;
            const getSellPrice = getProduct === null || getProduct === void 0 ? void 0 : getProduct.sellPrice;
            const getIsAfterTax = getProduct === null || getProduct === void 0 ? void 0 : getProduct.isAfterTax;
            const getStock = getProduct === null || getProduct === void 0 ? void 0 : getProduct.stock;
            const checkCart = yield Cart_model_1.Cart.countDocuments({ status: "on-process", product_id: inputProductId, admin_id: getUserId });
            let countTax;
            let quantity;
            (!inputQuantity || inputQuantity == 0) ? quantity = 1 : quantity = inputQuantity;
            (getIsAfterTax == "no") ? countTax = getSellPrice * 10 / 100 : countTax = 0;
            let createCart;
            let updateCart;
            const countStock = getStock - quantity;
            let createNotification;
            let updateStockData;
            let updateStock;
            try {
                const totalPrice = getSellPrice * quantity;
                const tax = countTax * quantity;
                if (getProduct.status == "inactive") {
                    res.status(500).json({ success: false, message: "Product Inactive: Produk ini tidak dijual" });
                }
                else if (checkCart == 0) {
                    createCart = yield Cart_model_1.Cart.create({
                        admin_id: getUserId,
                        product_id: inputProductId,
                        brand_name: getBrandName,
                        product_name: getProductName,
                        uom: getUom,
                        quantity: quantity,
                        price: getSellPrice,
                        tax: tax,
                        totalPrice: totalPrice,
                    });
                }
                else {
                    updateCart = yield Cart_model_1.Cart.findOneAndUpdate({ status: "on-process", product_id: inputProductId, admin_id: getUserId }, { $inc: { quantity: quantity } }, { new: true });
                }
            }
            catch (err) {
                next(err);
            }
            finally {
                if (countStock <= 10) {
                    createNotification = yield Notification_model_1.Notification.create({ message: getProductName + "stock is under 10! product status will be set to inactive" });
                    updateStockData = { $inc: { stock: -quantity }, status: "inactive" };
                }
                else {
                    updateStockData = { $inc: { stock: -quantity } };
                }
                ;
                updateStock = yield Product_model_1.Product.findByIdAndUpdate(inputProductId, updateStockData, { new: true });
                res.status(201).json({ success: true, message: "product added to cart", data: createCart });
            }
        });
    }
    static listCart(req, res, next) {
        Cart_model_1.Cart.find({ status: "on-process" })
            .then((result) => {
            res.status(200).json({ success: true, message: "Cart items: ", data: result });
        })
            .catch((err) => {
            res.sendStatus(404);
        });
    }
    static cancelItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart_id = req.params.cart_id;
            const inputNotes = req.body.notes;
            const getCart = yield Cart_model_1.Cart.findById(cart_id);
            const getQuantity = getCart === null || getCart === void 0 ? void 0 : getCart.quantity;
            const getProductId = getCart === null || getCart === void 0 ? void 0 : getCart.product_id;
            const getProduct = yield Product_model_1.Product.findById(getProductId);
            const getStock = getProduct === null || getProduct === void 0 ? void 0 : getProduct.stock;
            const countStock = getStock + getQuantity;
            let updateProductData;
            let updateStatus;
            let updateProductStock;
            try {
                if (countStock < 10) {
                    updateProductData = { $inc: { quantity: getQuantity }, status: "active" };
                }
                else {
                    updateProductData = { $inc: { quantity: getQuantity } };
                }
                updateProductStock = yield Product_model_1.Product.findByIdAndUpdate(getProductId, updateProductData, { new: true });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
            finally {
                updateStatus = yield Cart_model_1.Cart.findByIdAndUpdate(cart_id, { status: "cancel", notes: inputNotes }, { new: true });
                next();
            }
        });
    }
    static checkOut(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const getUserId = req.user_id;
            const getCart = yield Cart_model_1.Cart.find({ status: "on-process", admin_id: getUserId });
            const items = yield Cart_model_1.Cart.find({ status: "on-process", admin_id: getUserId }).select('-status -admin_id -product_id -date');
            let totalTax = 0;
            let totalPrice = 0;
            let subtotal = totalPrice + totalTax;
            let createReceipt;
            let updateStatus;
            try {
                for (let i in getCart) {
                    totalPrice += getCart[i].totalPrice;
                    totalTax += getCart[i].tax;
                }
                ;
                createReceipt = yield Receipt_model_1.Receipt.create({
                    items: items,
                    totalTax: totalTax,
                    subtotal: subtotal,
                });
            }
            catch (err) {
                console.log("err checkout controller:" + err);
                next(err);
            }
            finally {
                updateStatus = yield Cart_model_1.Cart.updateMany({ status: "on-process", admin_id: getUserId }, { $set: { status: "sold" } });
                next();
            }
        });
    }
}
exports.default = cashierController;