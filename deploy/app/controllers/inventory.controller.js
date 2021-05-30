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
const Order_model_1 = require("../models/Order.model");
const Suplier_model_1 = require("../models/Suplier.model");
const Product_model_1 = require("../models/Product.model");
const Delivery_model_1 = require("../models/Delivery.model");
const Invoice_model_1 = require("../models/Invoice.model");
class inventoryController {
    static createSuplier(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputSuplierName = req.body.suplier_name.toUpperCase();
            const inputContact = req.body.contact;
            const inputAddress = req.body.address;
            let createSuplier;
            try {
                createSuplier = yield Suplier_model_1.Suplier.create({
                    suplier_name: inputSuplierName,
                    contact: inputContact,
                    address: inputAddress,
                });
            }
            catch (err) {
                next(err);
            }
            finally {
                res.status(201).json({ success: true, message: "Suplier created", data: createSuplier });
            }
        });
    }
    static listSuplier(req, res, next) {
        Suplier_model_1.Suplier.find()
            .then((result) => {
            res.status(200).json({ success: true, message: "Suplier list:", data: result });
        })
            .catch((err) => {
            next(err);
        });
    }
    static listNames(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const listBrandName = yield Product_model_1.Product.aggregate([
                { $match: {} },
                { $group: { _id: '$brand_name', total: { $sum: '$stock' } } },
            ]);
            const listProductName = yield Product_model_1.Product.aggregate([
                { $match: {} },
                { $group: { _id: '$product_name', total: { $sum: '$stock' } } },
            ]);
            const listUom = yield Product_model_1.Product.aggregate([
                { $match: {} },
                { $group: { _id: '$uom', total: { $sum: '$stock' } } },
            ]);
            try {
                let getBrandName = [];
                let getProductName = [];
                let getUom = [];
                for (let i = 0; i < listBrandName.length; i++) {
                    getBrandName.push(listBrandName[i]._id);
                }
                ;
                for (let i = 0; i < listProductName.length; i++) {
                    getProductName.push(listProductName[i]._id);
                }
                ;
                for (let i = 0; i < listUom.length; i++) {
                    getUom.push(listUom[i]._id);
                }
                ;
                let data = { brand_name: getBrandName, product_name: getProductName, uom: getUom };
                res.status(200).json({ success: true, message: "brand_name, product_name, uom", data: data });
            }
            catch (err) {
                next(err);
            }
        });
    }
    static createProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputSuplierName = req.body.suplier_name.toUpperCase();
            const inputBrandName = req.body.brand_name.toUpperCase();
            const inputProductName = req.body.product_name.toUpperCase();
            const inputImage = req.body.image;
            const inputUom = req.body.uom.toUpperCase();
            const inputSellPrice = req.body.sellPrice;
            const inputBarcode = req.body.barcode;
            const inputBuyPrice = req.body.buyPrice;
            const inputIsAfterTax = req.body.isAfterTax.toLowerCase();
            const checkProduct = yield Product_model_1.Product.countDocuments({ brand_name: inputBrandName, product_name: inputProductName, uom: inputUom });
            const getSuplier = yield Suplier_model_1.Suplier.findOne({ suplier_name: inputSuplierName });
            const getSuplierId = getSuplier === null || getSuplier === void 0 ? void 0 : getSuplier.id;
            const checkBrands = getSuplier === null || getSuplier === void 0 ? void 0 : getSuplier.brands;
            let brandIsExist = checkBrands === null || checkBrands === void 0 ? void 0 : checkBrands.includes(inputBrandName);
            let pushBrand;
            let createProduct;
            try {
                if (getSuplierId === undefined) {
                    res.status(422).json({ success: false, message: "Suplier not found" });
                }
                else if (checkProduct === 0) {
                    createProduct = yield Product_model_1.Product.create({
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
                }
                else {
                    res.status(400).json({ success: false, message: "This product has already created! cannot create more than one" });
                }
            }
            catch (err) {
                next(err);
            }
            finally {
                if (!brandIsExist) {
                    pushBrand = yield Suplier_model_1.Suplier.findByIdAndUpdate(getSuplierId, { $push: { brands: inputBrandName } }, { new: true });
                }
                ;
                res.status(201).json({ success: true, message: "Product created", data: createProduct });
            }
        });
    }
    static purchaseOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputBarcode = req.body.barcode;
            const inputDiscount = req.body.discount;
            const inputQuantity = req.body.quantity;
            const getProduct = yield Product_model_1.Product.findOne({ barcode: inputBarcode });
            const getBrandName = getProduct === null || getProduct === void 0 ? void 0 : getProduct.brand_name;
            const getSuplierName = getProduct === null || getProduct === void 0 ? void 0 : getProduct.suplier_name;
            const getUom = getProduct === null || getProduct === void 0 ? void 0 : getProduct.uom;
            const getBuyPrice = getProduct === null || getProduct === void 0 ? void 0 : getProduct.buyPrice;
            const getIsAfterTax = getProduct === null || getProduct === void 0 ? void 0 : getProduct.isAfterTax;
            const getProductId = getProduct === null || getProduct === void 0 ? void 0 : getProduct.id;
            const countDiscount = getBuyPrice * (inputDiscount / 100);
            const countTotalBuyPrice = getBuyPrice - countDiscount;
            const countSubTotal = countTotalBuyPrice * inputQuantity;
            const getSuplier = yield Suplier_model_1.Suplier.findOne({ suplier_name: getSuplierName });
            const getSuplierId = getSuplier === null || getSuplier === void 0 ? void 0 : getSuplier.id;
            const checkOrder = yield Order_model_1.Order.countDocuments({ suplier_id: getSuplierId, product_id: getProductId, status: "on-process" });
            const checkInvoice = yield Invoice_model_1.Invoice.countDocuments({ suplier_id: getSuplierId, status: "unpaid" });
            let createOrder;
            let createInvoice;
            let updateInvoice;
            let discount;
            (!inputDiscount) ? discount = 0 : discount = inputDiscount;
            try {
                if (checkOrder !== 0) {
                    const listOnProcessOrder = yield Order_model_1.Order.find({ suplier_id: getSuplierId, product_id: getProductId, status: "on-process" });
                    res.status(500).json({ success: false, message: "You have an unfinished order, you can force this by edit previous order status first into: force-complete", data: listOnProcessOrder });
                }
                else {
                    createOrder = yield Order_model_1.Order.create({
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
                next(err);
            }
            finally {
                if (createOrder.id === undefined) {
                    console.log("Failed to create order");
                }
                else if (checkInvoice == 0) {
                    createInvoice = yield Invoice_model_1.Invoice.create({
                        suplier_id: getSuplierId,
                        orders: createOrder.id,
                        bill: countSubTotal,
                    });
                }
                else {
                    updateInvoice = yield Invoice_model_1.Invoice.findOneAndUpdate({ suplier_id: getSuplierId, status: "unpaid" }, { $push: { orders: createOrder.id }, $inc: { bill: countSubTotal } }, { new: true });
                }
                ;
                res.status(201).json({ success: true, message: "Order created", data: createOrder });
            }
        });
    }
    static deliveryOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputArrivedQuantity = req.body.arrivedQuantity;
            const inputBarcode = req.body.barcode;
            const getProduct = yield Product_model_1.Product.findOne({ barcode: inputBarcode });
            const getProductId = getProduct === null || getProduct === void 0 ? void 0 : getProduct.id;
            const getSuplierName = getProduct === null || getProduct === void 0 ? void 0 : getProduct.suplier_name;
            const getSuplier = yield Suplier_model_1.Suplier.findOne({ suplier_name: getSuplierName });
            const getSuplierId = getSuplier === null || getSuplier === void 0 ? void 0 : getSuplier.id;
            const getOrder = yield Order_model_1.Order.findOne({ suplier_id: getSuplierId, product_id: getProductId, status: "on-process" });
            const getOrderId = getOrder === null || getOrder === void 0 ? void 0 : getOrder.id;
            const getQuantity = getOrder === null || getOrder === void 0 ? void 0 : getOrder.quantity;
            const arrived = getOrder === null || getOrder === void 0 ? void 0 : getOrder.arrived;
            const tryMatchQuantity = arrived + inputArrivedQuantity - getQuantity;
            let createDelivery;
            let updateProduct;
            let updateOrderData;
            let updateOrder;
            if (tryMatchQuantity === 0) {
                updateOrderData = { $inc: { arrived: inputArrivedQuantity }, status: "complete" };
            }
            else if (tryMatchQuantity < 0) {
                updateOrderData = { $inc: { arrived: inputArrivedQuantity } };
            }
            else {
                res.status(400).json({ success: false, message: "Wrong input arrived quanitity, count carefully", data: getOrder });
            }
            try {
                createDelivery = yield Delivery_model_1.Delivery.create({
                    order_id: getOrderId,
                    arrivedQuantity: inputArrivedQuantity,
                });
                updateProduct = yield Product_model_1.Product.findByIdAndUpdate(getProductId, { $inc: { stock: inputArrivedQuantity } }, { new: true });
                updateOrder = yield Order_model_1.Order.findByIdAndUpdate(getOrderId, updateOrderData, { new: true });
            }
            catch (err) {
                console.log("inventory_controller_err: " + err);
                next(err);
            }
            finally {
                res.status(201).json({ success: true, message: "Delivery created, Order updated, Product updated", data: "Too Much Im Spinning" });
            }
        });
    }
    static listProduct(req, res, next) {
        Product_model_1.Product.find()
            .then((result) => {
            res.status(200).json({ success: true, message: "All Products:", data: result });
        })
            .catch((err) => {
            next(err);
        });
    }
    static searchProduct(req, res, next) {
        const keywords = req.body.keywords;
        const brand_name = req.body.brand_name.toUpperCase();
        Product_model_1.Product.find({ brand_name: brand_name, $text: { $search: keywords } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } })
            .then((result) => {
            res.status(200).json({ success: true, message: "Product found: ", data: result });
        })
            .catch((err) => {
            next(err);
        });
    }
    static setProductStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const getProduct = yield Product_model_1.Product.findById(req.params.product_id);
            const getProductStatus = getProduct === null || getProduct === void 0 ? void 0 : getProduct.status;
            let newStatus;
            let updateStatus;
            try {
                if (getProductStatus === "inactive") {
                    newStatus = "active";
                }
                else {
                    newStatus = "inactive";
                }
                updateStatus = yield Product_model_1.Product.findByIdAndUpdate(req.params.product_id, { status: newStatus }, { new: true });
            }
            catch (err) {
                next(err);
            }
            finally {
                res.status(200).json({ success: true, message: "Product status updated:", data: updateStatus });
            }
        });
    }
}
exports.default = inventoryController;
