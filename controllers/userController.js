import UserModel from "../models/user" 
import ErrorHandler from "../utils/errorHandler.js";
import AtmModel from "../models/atm.js"
import bcrypt from "bcryptjs";

export const getLoggedInUser = async(req,res,next)=>{
    const {_id} = req.user;

    try {  
        const user = await UserModel.findById(_id);    
        const fundedAtms = await AtmModel.find({ isFunded: true })
        const attemptedAtms = await AtmModel.find({ isFunded: false })
        const UserCount = await UserModel.countDocuments()

        let admin = {}

        if (user.role === "admin") {
            admin.userCount = UserCount
            admin.fundedAtmsCount=fundedAtms.length
            admin.attemptedAtmsCount=attemptedAtms.length
        }


        return res.status(200).json({
            success: true,
            user,  
            admin
        })

    } catch (error) {
        return next(error)
    }
}

 
export const deleteMyAccount = async(req,res,next)=>{
    const {password} = req.body
    const{_id} = req.user

    try {  

        const user = await UserModel.findById(_id).select("+password");

        if(!password) return next(new ErrorHandler("Please Enter password",200))

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return next(new ErrorHandler("Invalid Password",200))
        }
        user.isDeactivated = true
        user.save()

        

        return res.status(200).json({
            success: true,
            message: "Account Deactivated. Account will be permanently deleted after 30 days. To reactivated within 30 days contact our support team"
        })

    } catch (error) {
        return next(error)
    }
}

 