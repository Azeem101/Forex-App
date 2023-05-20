import adminModel from '../model/adminModel.js'
import botindicatorModel from '../model/botindicatorModel.js';
import JWT from 'jsonwebtoken';
import bcrypt from "bcrypt";
import path from 'path'
export const adminLogin = async (req, res) => {

    try {


        const { email, password } = req.body;

        if (!email || !password) {
            res.status(401).send({
                success: false,
                message: "Please fill all fields ThankYou!",
            })
        }
        const user = await adminModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registerd",
            });
        }
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Email and Password",
            });
        }

        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(200).send({
            success: true,
            message: "Successfully Login",
            user,
            token
        })
    } catch (error) {
        console.log(error)
    }
}
//test controller
export const testController = (req, res) => {
    try {
        res.send("Protected Routes");
    } catch (error) {
        console.log(error);
        res.send({ error });
    }
};


export const adminregister = async (req, res) => {
    try {


        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(401).send({
                success: false,
                message: "Please fill all fields ThankYou!",
            })
        }
        const existingUser = await adminModel.findOne({ email });

        if (existingUser) {
            res.status(401).send({
                success: false,
                message: "Email already registered",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await new adminModel({
            name,
            email,
            password: hashedPassword,
        }).save()
        res.status(200).send({
            success: true,
            message: "admin registered Successfully",
            user
        })
    } catch (error) {
        console.log("Error in admin register controller")
    }

};


export const botindicator = async (req, res) => {
    try {
        const { name } = req.body
        const file = req.file;
        const filepath = file.path
        const filename = file.originalname
        if (!filepath || !filename || !name) {
            return res.status(401).send({
                success: false,
                message: "Please fill all fields ThankYou!",
            })
        }

        const fullDoc = await new botindicatorModel({
            check: name,
            filepath,
            filename
        }).save()
        res.status(200).send({
            success: true,
            message: "File uploaded Successfully",
            fullDoc
        })
    } catch (error) {
        console.log(error)
    }
}


export const downloadBotIndicator = async (req, res) => {
    try {
        const { id } = req.params;
        const findfile = await botindicatorModel.findById(id)
        if (!findfile) {
            return res.status(401).send({
                success: false,
                message: "File Not Found",
            })
        }


        res.download(findfile.filepath, findfile.filename);
    } catch (error) {
        console.log(error);
    }
}

export const getallai = async (req, res) => {
    try {

        const findfile = await botindicatorModel.find({})
        if (!findfile) {
            return res.status(401).send({
                success: false,
                message: "File Not Found",
            })
        }


        return res.status(200).send({
            success: true,
            counTotal: findfile.length,
            findfile
        });
    } catch (error) {
        console.log(error);
    }
}