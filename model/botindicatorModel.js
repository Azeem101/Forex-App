import mongoose from "mongoose";


const botIndicator = mongoose.Schema({
    check: {
        type: Number,
        required: true,
    },
    filepath: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },

}, { timestamps: true })

export default mongoose.model("FxBotIndicator", botIndicator);