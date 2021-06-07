"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorHandler(err, req, res, next) {
    let name = err.name;
    let code;
    let message;
    switch (name) {
        case "unfinish_order":
            code = 422;
            message = "You have an unfinished order, you can force this by edit previous order status first into: force-complete";
            break;
        case "wrong_input_quantity":
            code = 422;
            message = "Wrong input arrived quanitity, count carefully";
            break;
        default:
            code = 500;
            message = "Internal Server Error";
    }
    res.status(code).json({ success: false, message });
}
exports.default = errorHandler;
