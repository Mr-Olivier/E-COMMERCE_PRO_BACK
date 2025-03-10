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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrievePaymentIntent = exports.createPaymentIntent = void 0;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}
const stripe = new stripe_1.default(stripeSecretKey, {
    apiVersion: "2023-10-16", // Use the latest API version
});
const createPaymentIntent = (amount_1, ...args_1) => __awaiter(void 0, [amount_1, ...args_1], void 0, function* (amount, currency = "usd", metadata = {}) {
    try {
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency,
            metadata,
            automatic_payment_methods: {
                enabled: true,
            },
        });
        return paymentIntent;
    }
    catch (error) {
        console.error("Error creating payment intent:", error);
        throw error;
    }
});
exports.createPaymentIntent = createPaymentIntent;
const retrievePaymentIntent = (paymentIntentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield stripe.paymentIntents.retrieve(paymentIntentId);
    }
    catch (error) {
        console.error("Error retrieving payment intent:", error);
        throw error;
    }
});
exports.retrievePaymentIntent = retrievePaymentIntent;
exports.default = {
    createPaymentIntent: exports.createPaymentIntent,
    retrievePaymentIntent: exports.retrievePaymentIntent,
    stripe,
};
