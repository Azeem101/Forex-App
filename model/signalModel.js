import mongoose from "mongoose";


const signalSchema = mongoose.Schema({
    signal: {
        type: String,
        required: true,
    },
    signalType: {
        type: String,
        required: true,
    },
    signalDate: {
        type: String,
        required: true,
    },
    signalTime: {
        type: String,
        required: true,
    },
    signalEnterPrice: {
        type: String,
        required: true,
    },

    signalST: {
        type: String,
        required: true,
    },
    signalTP: {
        type: String,
        required: true,
    },
}, { timestamps: true })

export default mongoose.model("FxSignal", signalSchema);