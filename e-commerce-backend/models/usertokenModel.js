import mongoose from "mongoose";

const userTokenSchema = new mongoose.Schema({
    userId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    ],
    jwt: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const UserToken = mongoose.model("userToken", userTokenSchema);
export default UserToken;

