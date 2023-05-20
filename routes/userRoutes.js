import express from "express";
import { registerController, loginController, getPaymentCheck, brainTreePaymentController, brainTreeTokenController, UpdateforgetController, forgetController, verifyController, getUser, getAllUser, deleteUserController, testController } from "../controller/usercontroller.js";
import { isExpert, requireSignin } from "../authHelper/requireSign.js";

//router object
const router = express.Router();



//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//foreget password
router.post("/forget", forgetController);

router.put("/verifynewpassword/:id", UpdateforgetController);


router.put("/verify", verifyController);

//REGISTER || METHOD POST
router.post("/login", loginController);

router.get("/user", requireSignin, getUser);

//test routes
router.get("/test", requireSignin, testController);

router.get("/getalluser", getAllUser);

//protected User route auth
router.get("/user-auth", requireSignin, isExpert, (req, res) => {
    res.status(200).send({ ok: true });
});

router.delete("/deleteuser/:id", deleteUserController);

//payments route
router.get('/braintree/token', brainTreeTokenController)
router.post('/braintree/payment', brainTreePaymentController)


router.get('/getpayment/:id', getPaymentCheck)




//automation

// router.post('/trading', trading)


export default router;