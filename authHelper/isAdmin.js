import adminModel from "../model/adminModel.js";

import JWT from "jsonwebtoken";
//Protected Routes token base
export const requireSignin = async (req, res, next) => {
    try {
        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
    }
};

//admin acceess
export const isAdmin = async (req, res, next) => {
    try {
        const user = await adminModel.findById(req.user._id);
        if (user.role !== 2) {
            return res.status(401).send({
                success: false,
                message: "UnAuthorized Access",
            });
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            error,
            message: "Error in admin middelware",
        });
    }
};
