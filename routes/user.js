import  express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import {agreeToCreatorTerms,getLoggedInUser,reportUser,blockUser,unblockUser,deleteMyAccount,setAccountType} from "../controllers/userController"

const router = express.Router()

router.route('/me').get(authenticateUser,getLoggedInUser); 

router.route('/me/delete').post(authenticateUser,deleteMyAccount); 





export default router;