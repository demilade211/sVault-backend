import  express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import {agreeToCreatorTerms,getLoggedInUser,reportUser,blockUser,unblockUser,deleteMyAccount,setAccountType} from "../controllers/userController"

const router = express.Router()

router.route('/me').get(authenticateUser,getLoggedInUser);

router.route('/report/:reportedUserId').post(authenticateUser,reportUser);

router.route('/me/delete').post(authenticateUser,deleteMyAccount);
router.route('/me/add-type').post(authenticateUser,setAccountType);
router.route('/me/agree').post(authenticateUser,agreeToCreatorTerms);

router.route('/block/:blockedUserId').post(authenticateUser,blockUser);
router.route('/unblock/:blockedUserId').put(authenticateUser,unblockUser);





export default router;