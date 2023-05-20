import expertModel from "../model/expertModel.js";
import bcrypt from "bcrypt";

import nodemailer from 'nodemailer';
import fs from "fs";
import UserModel from "../model/UserModel.js";
import signalModel from "../model/signalModel.js";
import approveExpert from "../model/approveExpert.js";
export const registerController = async (req, res) => {
    try {


        const { name, email, password, phone, strategy } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !email:
                return res.status(500).send({ error: "email is Required" });
            case !password:
                return res.status(500).send({ error: "password is Required" });
            case !phone:
                return res.status(500).send({ error: "phone is Required" });
            case !strategy:
                return res.status(500).send({ error: "strategy is Required" });
            case photo && photo.size > 1000000:
                return res
                    .status(500)
                    .send({ error: "photo is Required and should be less then 1mb" });
        }

        // Check if email already exists

        const emailExists = await expertModel.findOne({ email }) || await UserModel.findOne({ email });

        if (emailExists) {
            return res.status(401).send({
                success: false,
                message: 'Email already registered'
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const expert = await new expertModel({
            name,
            email,
            password: hashedPassword,
            phone,
            strategy,

        })
        if (photo) {
            expert.photo.data = fs.readFileSync(photo.path);
            expert.photo.contentType = photo.type;
        }



        const expertcheck = await expert.save()

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "azeemnaeem243@gmail.com", // generated ethereal user
                pass: "pgjorxsqvpycxsmy", // generated ethereal password
            },
        });

        let info = await transporter.sendMail({
            from: '"Fx Signals 👻" <FxSignals@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Email Verification ✔", // Subject line
            text: "Verify Your Gmail By clicking on this link?", // plain text body
            html: `<b>Hello ${name} Please Click Here To Verify<a href='http://localhost:3000/expertverify?id=${expertcheck._id} >Verify</a></b>`, // html body
        });

        res.status(200).send({
            success: true,
            message: "Expert registered Successfully",
            expertcheck,
        })
    } catch (error) {
        console.log("Error in user controller")
    }

}

export const verifyController = async (req, res) => {
    try {
        const id = req.query.id
        const verifyMail = await expertModel.findByIdAndUpdate(
            id,
            { verify: true },
            { new: true }
        );
        res.status(200).send({
            success: true,
            messsage: "User verified Successfully",
            verifyMail,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while updating User verification",
        });
    }

}

export const approveregisterController = async (req, res) => {
    try {


        const { id } = req.params;


        const expert = await expertModel.findById(id)

        const { name, email, password, phone, strategy, photo } = expert


        try {
            const confrimExpert = await new approveExpert({
                _id: id,
                name,
                email,
                password,
                phone,
                strategy,
                photo
            })

            const user1 = await new UserModel({
                _id: id,
                name,
                email,
                password,
                role: 1
            })


            await Promise.all([confrimExpert.save(), user1.save()]);
            res.status(200).send({
                success: true,
                message: "Expert registered Successfully",
                confrimExpert,
                user1
            })
        } catch (error) {
            console.log(error)
        }





    } catch (error) {
        console.log("Error in approve controller")
    }

}

export const registerSignal = async (req, res) => {
    try {


        const { signal, signalType, signalDate, signalTime, signalEnterPrice, signalST, signalTP } = req.body;

        const store = await new signalModel({
            signal,
            signalType,
            signalDate,
            signalTime,
            signalEnterPrice,
            signalST,
            signalTP,
        }).save();



        res.status(200).send({
            success: true,
            message: "Signal uploaded",
            store,
        })
    } catch (error) {
        console.log("Error in signal controller")
    }
}

export const getSignal = async (req, res) => {
    try {
        const signals = await signalModel
            .find({})
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            counTotal: signals.length,
            message: "ALl signals ",
            signals,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Erorr in getting signals",
            error: error.message,
        });
    }
};

export const getAllExpert = async (req, res) => {
    let expert;
    try {
        expert = await expertModel.find({}).select("-photo");
    } catch (err) {
        return new Error(err);
    }
    if (!expert) {
        return res.status(404).send({ messsage: "expert Not FOund" });
    }
    return res.status(200).send({
        success: true,
        counTotal: expert.length,
        expert
    });
}
export const getAllApproveExpert = async (req, res) => {
    let expert;
    try {
        expert = await approveExpert.find({}).select("-photo");
    } catch (err) {
        return new Error(err);
    }
    if (!expert) {
        return res.status(404).send({ messsage: "expert Not FOund" });
    }
    return res.status(200).send({
        success: true,
        counTotal: expert.length,
        expert
    });

}

// get photo
export const expertApprovedPhotoController = async (req, res) => {
    try {
        const prove = await approveExpert.findById(req.params.id).select("photo");

        if (prove.photo.data) {
            res.set("Content-type", prove.photo.contentType);
            return res.status(200).send(prove.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Erorr while getting photo",
            error,
        });
    }
};
// get photo
export const expertPhotoController = async (req, res) => {
    try {

        const prove = await expertModel.findById(req.params.id).select("photo");


        if (prove.photo.data) {
            res.set("Content-type", prove.photo.contentType);
            return res.status(200).send(prove.photo.data);
        } else {
            console.log("not found")
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Erorr while getting photo",
            error,
        });
    }
};

//delete controller
export const deleteExpertController = async (req, res) => {
    try {
        await expertModel.findByIdAndDelete(req.params.id);
        res.status(200).send({
            success: true,
            message: "Expert Deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while deleting product",
            error,
        });
    }
};


export const deleteSignalController = async (req, res) => {
    try {
        await signalModel.findByIdAndDelete(req.params.id);
        res.status(200).send({
            success: true,
            message: "Signal Deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while deleting product",
            error,
        });
    }
};
