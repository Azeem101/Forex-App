import express from "express";
import { adminLogin, adminregister, botindicator, getallai, downloadBotIndicator } from "../controller/adminController.js";
import { isAdmin, requireSignin } from '../authHelper/isAdmin.js'
import upload from '../middleware/multer.js'
//router object
const router = express.Router();



//routing
//REGISTER || METHOD POST
router.post("/register", adminregister);


//REGISTER || METHOD POST
router.post("/login", adminLogin);

//protected User route auth
router.get("/admin-auth", requireSignin, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});



router.post("/botindicator", upload.single('file'), botindicator);

router.get("/download/:id", downloadBotIndicator);

router.get("/getallai", getallai);




export default router;