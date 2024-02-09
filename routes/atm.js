import  express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { getAtm,getAtmById,checkPin} from "../controllers/atmController";

const router = express.Router()

router.route('/').get(authenticateUser,getAtm); 
router.route('/:atmId').get(authenticateUser,getAtmById); 
router.route('/check/:atmId').post(checkPin); 


export default router;