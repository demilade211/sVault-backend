import  express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import {createWithdrawalAccount,getBankList,validateAccountNumber,getWithdrawalAccount,makeWithdrawal,getWithdrawalHistory} from "../controllers/withdrawalController";

const router = express.Router()

router.route('/account').post(createWithdrawalAccount);
router.route('/account').get(authenticateUser,getWithdrawalAccount);

// router.route('/validate/account').post(authenticateUser,validateAccountNumber);

router.route('/list/bank').get(getBankList);

router.route('/withdraw/:atmId')
    .post(makeWithdrawal)
    .get(authenticateUser,getWithdrawalHistory);




export default router;