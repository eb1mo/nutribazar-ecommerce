import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        product: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
        ],
        firstName: {
            type: String,
            required: false,
        },
        lastName: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: false,
        },
        shippingAddress: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: false,
        },
        zipcode: {
            type: Number,
            required: false,
        },
        phone: {
            type: Number,
            required: false,
        },
        quantity: {
            type: Number,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        
    },
    { timestamps: true }
);
const OrderItem = mongoose.model("OrderItem", orderItemSchema);
export default OrderItem;