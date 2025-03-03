import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "user canceled"],
            default: "pending",
        },
        purchase_order_id: {
            type: String,
            required: false,
        },
        payment_token: {
            type: String,
            required: false,
        },
        amount: {
            type: Number,
            required: true,
        }
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;