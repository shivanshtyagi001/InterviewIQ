import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import razorpay from "../services/razorpay.service.js";
import crypto from "crypto";

export const createOrder = async (req, res) => {
    try {
        const { planId, amount, credits } = req.body;

        console.log("Payment Request:", {
            planId,
            amount,
            credits,
            userId: req.userId
        });

        if (!amount || !credits) {
            return res.status(400).json({
                message: "Invalid plan data"
            });
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        console.log("Creating Razorpay order:", options);

        const order = await razorpay.orders.create(options);

        console.log("Razorpay Order Created:", order.id);

        await Payment.create({
            userId: req.userId,
            planId,
            amount,
            credits,
            razorpayOrderId: order.id,
            status: "created",
        });

        return res.json(order);

    } catch (error) {
        console.error("RAZORPAY ORDER ERROR:", error);

        return res.status(500).json({
            message: `Failed to create Razorpay order: ${error.message}`
        });
    }
};


export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const body =
            razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                message: "Invalid payment signature"
            });
        }

        const payment = await Payment.findOne({
            razorpayOrderId: razorpay_order_id,
        });

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        if (payment.status === "paid") {
            return res.json({
                message: "Already processed"
            });
        }

        payment.status = "paid";
        payment.razorpayPaymentId = razorpay_payment_id;

        await payment.save();

        const updatedUser = await User.findByIdAndUpdate(
            payment.userId,
            {
                $inc: {
                    credits: payment.credits
                }
            },
            {
                new: true
            }
        );

        res.json({
            success: true,
            message: "Payment verified and credits added",
            user: updatedUser,
        });

    } catch (error) {
        console.error("RAZORPAY VERIFY ERROR:", error);

        return res.status(500).json({
            message: `Failed to verify Razorpay payment: ${error.message}`
        });
    }
};