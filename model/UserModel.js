import mongoose from "mongoose";


const userSchema = mongoose.Schema({
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
    verify: {
        type: Boolean,
        default: false,
    },
    role: {
        type: Number,
        default: 0,
    },
}, { timestamps: true })

export default mongoose.model("FxUser", userSchema);