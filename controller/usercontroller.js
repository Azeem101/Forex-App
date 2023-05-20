import UserModel from "../model/UserModel.js";
import expertModel from "../model/UserModel.js";
import bcrypt from "bcrypt";
import JWT from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import braintree from 'braintree'
import orderModel from '../model/orderModel.js'
import dotenv from 'dotenv';

dotenv.config();

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.MERCHANT_ID,
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
});


export const registerController = async (req, res) => {




    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(401).send({
            success: false,
            message: "Please fill all fields ThankYou!",
        })
    }
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
        return res.status(401).send({
            success: false,
            message: "Email already registered",
        })
    }
    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await new UserModel({
        name,
        email,
        password: hashedPassword,
    }).save()

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
        html: `<b>Hello ${name} Please Click Here To Verify<a href='http://localhost:3000/verify?id=${user._id} >Verify</a></b>`, // html body
    });



    res.status(200).send({
        success: true,
        message: "User registered Successfully",
        user
    })


};



export const forgetController = async (req, res) => {




    const { email } = req.body;

    if (!email) {
        return res.status(401).send({
            success: false,
            message: "Please fill the fields ThankYou!",
        })
    }

    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
        return res.status(401).send({
            success: false,
            message: "Email Not registered",
        })
    }

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
        subject: "Forget Password ✔", // Subject line
        text: "Verify Your Gmail By clicking on this link?", // plain text body
        html: `<b>Hello ${existingUser.name} Please Click Here To Update Your Password<a href='http://localhost:3000/changepassword?id=${existingUser._id} >Verify</a></b>`, // html body
    });



    res.status(200).send({
        success: true,
        message: "Email For password Change Successfully sent",
    })


};





export const UpdateforgetController = async (req, res) => {
    try {
        const id = req.params.id;
        const { password } = req.body;

        const checkUser = await UserModel.findById(id) || await expertModel.findById(id);
        if (checkUser.role == 0) {
            const hashedPassword = await bcrypt.hash(password, 8);

            const updatePassword = await UserModel.findByIdAndUpdate(
                id,
                { password: hashedPassword }, // correct type here
                { new: true }
            );
            res.status(200).send({
                success: true,
                messsage: "Password is updated Successfully",
                updatePassword,
            });
        } else if (checkUser.role == 1) {
            const hashedPassword = await bcrypt.hash(password, 8);

            const updatePassword = await expertModel.findByIdAndUpdate(
                id,
                { password: hashedPassword }, // correct type here
                { new: true }
            );
            res.status(200).send({
                success: true,
                messsage: "Password is updated Successfully",
                updatePassword,
            });
        } else {
            res.status(500).send({
                success: false,
                error,
                message: "Error while updating User verification",
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while updating User verification",
        });
    }

}

export const verifyController = async (req, res) => {
    try {
        const id = req.query.id;
        const verifyMail = await UserModel.findByIdAndUpdate(
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


export const loginController = async (req, res) => {

    try {


        const { email, password } = req.body;

        if (!email || !password) {
            res.status(401).send({
                success: false,
                message: "Please fill all fields ThankYou!",
            })
        }
        const user = await UserModel.findOne({ email })
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


export const getUser = async (req, res) => {
    const userId = req.id;
    let user;
    try {
        user = await UserModel.findById(userId);
    } catch (err) {
        return new Error(err);
    }
    if (!user) {
        return res.status(404).send({ messsage: "User Not FOund" });
    }
    return res.status(200).send({ user });
}

export const getAllUser = async (req, res) => {
    let user;
    try {
        user = await UserModel.find();
    } catch (err) {
        return new Error(err);
    }
    if (!user) {
        return res.status(404).send({ messsage: "User Not FOund" });
    }
    return res.status(200).send({
        success: true,
        counTotal: user.length,
        user
    });
}


//delete controller
export const deleteUserController = async (req, res) => {
    try {
        await UserModel.findByIdAndDelete(req.params.id);
        res.status(200).send({
            success: true,
            message: "User Deleted successfully",
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


//payment gateway api


export const brainTreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.send(response)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const brainTreePaymentController = async (req, res) => {
    // Create a new customer
    const { nonce, id } = req.body;
    const user = await UserModel.findById(id);
    let customerResult;
    // If customer ID is provided, check if it exists in the vault
    if (id) {
        try {
            customerResult = await gateway.customer.find(id);
        } catch (err) {
            // Customer does not exist, create a new customer
            customerResult = await gateway.customer.create({
                id,
                firstName: user.name,
            });

            if (!customerResult.success) {
                return res.status(500).send(customerResult.message);
            }
        }
    } else {
        // No customer ID provided, create a new customer
        customerResult = await gateway.customer.create({
            firstName: 'Not Know ',

        });

        if (!customerResult.success) {
            return res.status(500).send(customerResult.message);
        }
    }

    // Store the payment method in the vault
    const paymentMethodResult = await gateway.paymentMethod.create({
        customerId: id,
        paymentMethodNonce: nonce,
    });

    if (!paymentMethodResult.success) {
        return res.status(500).send(paymentMethodResult.message);
    }

    // Create the subscription using the vaulted payment method
    const subscriptionResult = await gateway.subscription.create({
        paymentMethodToken: paymentMethodResult.paymentMethod.token,
        planId: 'hn32',
    });

    if (subscriptionResult) {
        const order = new orderModel({
            payment: subscriptionResult,
            buyer: id,
        }).save();
    }

    if (!subscriptionResult.success) {
        return res.status(500).send(subscriptionResult.message);
    }

    // Subscription created successfully
    res.json({ ok: true });


}




export const getPaymentCheck = async (req, res) => {
    try {
        const { id } = req.params;

        const check = await orderModel.find({ buyer: id });
        // console.log(check)
        if (!check) {
            return res.status(500).send({
                success: false,
                check

            })
        }
        return res.status(200).send({
            success: true,
            message: " payment record found",
            check

        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while getting check payment",
            error,
        })
    }
}








// export const brainTreePaymentController = async (req, res) => {
//     try {
//         const { nonce } = req.body;

//         let newTransaction = gateway.transaction.sale(
//             {
//                 amount: 30.00,
//                 paymentMethodNonce: nonce,
//                 options: {
//                     submitForSettlement: true,
//                 },
//             },
//             function (error, result) {
//                 if (result) {
//                     const order = new orderModel({
//                         payment: result,
//                         buyer: req.id,
//                     }).save();
//                     res.json({ ok: true });
//                 } else {
//                     res.status(500).send(error);
//                 }
//             }
//         );
//     } catch (error) {
//         console.log(error)
//     }
// }



//automation


// export const trading = async (req, res) => {






    // const API_KEY = 'k82Il4ilIMnHwHKaATdcnTiaqDNZQwkBCYt2Va9FWe9nQ7kgzA14oamHKK2yOLsM'
    // const API_SECRET = 'IDHYGIJBco05VDfXi6WUDXpLBovrnpCN2zR9KR3r45WftR2x5SOBRw7DDfQV0s2K'

    // const client = new pkg({
    //     api_key: API_KEY,
    //     api_secret: API_SECRET,
    // });

    // client.accountInfo().then(response => {
    //     console.log(response);
    // }).catch(error => {
    //     console.error(error);
    // });








    // // Connect to MetaApi
    // const token = '5Bpdak1HuPKf5McNjtpBvrq578CmckUiSUpHWCNQaXWp6pFgMoEb58NLkiV9peVf';
    // const accountId = '7075a54f-69da-4d3a-a05b-4d3f509c5c06';

    // // Connect to MetaApi
    // const api = new MetaApi(token);


    // const account = await api.metatraderAccountApi.getAccount(accountId);


    // // wait until account is deployed and connected to broker
    // console.log('Deploying account');
    // await account.deploy();
    // console.log('Waiting for API server to connect to broker (may take couple of minutes)');
    // await account.waitConnected();

    // // connect to MetaApi API
    // let connection = account.getRPCConnection();
    // await connection.connect();


    // Add test MetaTrader account
    // let account = await api.metatraderAccountApi.getAccount(accountId);

    // let accounts = account.find(a => a.login === login && a.type.startsWith('cloud'));
    // console.log(accounts)
    // if (!account) {
    //     console.log('Adding MT4 account to MetaApi');
    //     account = await api.metatraderAccountApi.createAccount({
    //         name: 'Test account',
    //         type: 'cloud',
    //         login: login,
    //         password: password,
    //         server: serverName,
    //         platform: 'mt4',
    //         magic: 1000
    //     });
    // } else {
    //     console.log('MT4 account already added to MetaApi');
    // }

    // // wait until account is deployed and connected to broker
    // console.log('Deploying account');
    // await account.deploy();
    // console.log('Waiting for API server to connect to broker (may take couple of minutes)');
    // await account.waitConnected();

    // // connect to MetaApi API
    // let connection = account.getRPCConnection();
    // await connection.connect();

    // // wait until terminal state synchronized to the local state
    // console.log('Waiting for SDK to synchronize to terminal state (may take some time depending on your history size)');
    // await connection.waitSynchronized();

    // // invoke RPC API (replace ticket numbers with actual ticket numbers which exist in your MT account)
    // console.log('Testing MetaAPI RPC API');
    // console.log('account information:', await connection.getAccountInformation());


    // const mt4Account = {
    //     "port": 8000,
    //     "host": "localhost",
    //     "login": 22273443,
    //     "password": "Funworld123"
    // };

    // // Create a ZeroMQ socket
    // const socket = new zmq.Push;
    // const connectionUrl = `tcp://${mt4Account.host}:${mt4Account.port}`;
    // const connection = mt4zmqBridge.connect(connectionUrl);
    // // Connect to the MT4 account using mt4zmqBridge

    // // When the connection is established, send a message to the MT4 account
    // connection.on('connect', () => {
    //     console.log('Connected to MT4 account');

    //     // Send a message to the MT4 account using ZeroMQ
    //     socket.connect('tcp://localhost:8000');
    //     socket.send(JSON.stringify({ action: 'getAccountInfo' }));
    // });

    // // When a response is received from the MT4 account, log it to the console
    // socket.on('message', (response) => {
    //     console.log(`Received response from MT4 account: ${response.toString()}`);

    //     // Close the ZeroMQ socket
    //     socket.close();

    //     // Disconnect from the MT4 account
    //     connection.disconnect();
    // });

    // // Handle errors
    // connection.on('error', (err) => {
    //     console.error(`Error connecting to MT4 account: ${err}`);
    // });
// }