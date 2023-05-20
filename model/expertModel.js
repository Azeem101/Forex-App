import mongoose from "mongoose";


const expertSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    strategy: {
        type: String,
        required: true,
    },

    photo: {
        data: Buffer,
        contentType: String,
    },
    verify: {
        type: Boolean,
        default: false,
    },
    role: {
        type: Number,
        default: 3,
    },
}, { timestamps: true })

export default mongoose.model("FxExpert", expertSchema);