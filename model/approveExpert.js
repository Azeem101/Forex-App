import mongoose from "mongoose";


const approveExpert = mongoose.Schema({
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
    role: {
        type: Number,
        default: 1,
    },
}, { timestamps: true })

export default mongoose.model("FxApproveExpert", approveExpert);