import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {

        payment: {},
        buyer: {
            type: mongoose.ObjectId,
            ref: "fxusers",
        },
        status: {
            type: String,
            default: "Done",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
