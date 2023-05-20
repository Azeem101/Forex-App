import express from "express";
import { registerController, approveregisterController, verifyController, registerSignal, getSignal, getAllExpert, expertPhotoController, deleteExpertController, deleteSignalController, getAllApproveExpert, expertApprovedPhotoController } from "../controller/expertController.js";
import formidable from "express-formidable";
import { requireSignin } from "../authHelper/requireSign.js";
//router object
const router = express.Router();


router.post("/register", formidable(), registerController);

router.put("/verify", verifyController);
router.post("/approveregister/:id", approveregisterController);

router.post("/registersignal", registerSignal);


router.get("/get-signal", getSignal);


router.get("/getallexpert", getAllExpert);

router.get("/getallapproveexpert", getAllApproveExpert);

//get photo
router.get("/expertapprovephoto/:id", expertApprovedPhotoController);
//get photo
router.get("/expertphoto/:id", expertPhotoController);


router.delete("/deleteexpert/:id", deleteExpertController);


router.delete("/deletesignal/:id", deleteSignalController);



export default router;