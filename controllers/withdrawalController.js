import ErrorHandler from "../utils/errorHandler.js";
import axios from "axios"
import RecipientModel from "../models/recipient"
import WithdrawalModel from "../models/withdrawal"
import UserModel from "../models/user"
import dotenv from "dotenv";

dotenv.config({path: "config/config.env"});

const url = 'https://api.paystack.co';

let secreteKey = process.env.NODE_ENV === "DEVELOPMENT" ? process.env.PAYSTACK_SECRETE_KEY_TEST:process.env.PAYSTACK_SECRETE_KEY_LIVE

const config = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secreteKey}`
    }
}

export const createWithdrawalAccount = async(req,res,next)=>{
    const {_id} = req.user;
    const {name,accountNumber,bankCode} = req.body

    try {  

        const user = await UserModel.findById(_id)

        const paystackRes = await axios.get(`${url}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,config)
        
        const name = paystackRes.data.data.account_name

        const reciepient = { 
            type: "nuban",
            name,
            account_number:accountNumber,
            bank_code:bankCode,
            currency: "NGN"
        }

        const plan = { 
            name: `${name}'s Plan`,
            interval: "monthly", 
            amount: "200000"
        }

        
        
        const paystackResponse = await axios.post(`${url}/transferrecipient`,reciepient,config)
        
        const {recipient_code,details:{account_name,account_number,bank_code,bank_name}}= paystackResponse.data.data
        
        const createPlanResponse = await axios.post(`${url}/plan`,plan,config)

        const {plan_code,amount}= createPlanResponse.data.data

        const withdrawalAccount = { 
            user: _id,
            account_name,
            account_number,
            bank_name,
            bank_code,
            recipient_code,
            plan_code,
            subscription_amount:amount
        }



        const newAccount = await RecipientModel.create(withdrawalAccount);

        user.role = "creator";
        await user.save();

        
        return res.status(200).json({ 
            success: true,
            newAccount
        })

    } catch (error) {
        return next(error)
    }
}

export const getBankList = async(req,res,next)=>{
    try {  
        
        const paystackResponse = await axios.get(`${url}/bank`,config)
        

        return res.status(200).json({
            success: true,
            banks:paystackResponse.data.data
        })

    } catch (error) {
        return next(error)
    }
}

export const getWithdrawalAccount = async(req,res,next)=>{
    const {_id} = req.user;
    try {  
        
        const withdrawalAccount = await RecipientModel.findOne({user: _id})

        if(!withdrawalAccount)return  next(new ErrorHandler("No withdrawal Account Found",404))
        

        return res.status(200).json({
            success: true,
            withdrawalAccount
        })

    } catch (error) {
        return next(error)
    }
}

// export const validateAccountNumber = async(req,res,next)=>{

//     const {account_number,bank_code} = req.body

//     try {  
        
//         const paystackResponse = await axios.get(`${url}/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,config)

//         return res.status(200).json({
//             success: true,
//             account_name:paystackResponse.data.data.account_name
//         })

//     } catch (error) {
//         return next(error)
//     }
// }

export const makeWithdrawal = async(req,res,next)=>{

    const {_id} = req.user;
    const {amount} = req.body
    let convertedAmount = Number(amount)
    let withdrawalAmount = 0

    try {  

        const user = await UserModel.findById(_id)
        const withdrawalAccount = await RecipientModel.findOne({user:_id})

        if(!withdrawalAccount)return  next(new ErrorHandler("You must have a withdrawal account to withdraw",200))

        const details ={
            source:"balance",
            amount:Number(amount)*100,
            recipient:withdrawalAccount.recipient_code
        }

        if(convertedAmount <= 5000) withdrawalAmount = convertedAmount +10

        if(convertedAmount > 5000 && convertedAmount <= 50000) withdrawalAmount = convertedAmount +25

        if(convertedAmount > 50000) withdrawalAmount = convertedAmount + 50

        if(user.walletBalance < 500)return  next(new ErrorHandler("Minimum withdrawal is 500 naira",200))

        if(user.tcBalance < 2)return  next(new ErrorHandler("You must have at least 2 tuale points",200))

        if(withdrawalAmount > user.walletBalance)return  next(new ErrorHandler("Balance Insufficient for withdrawal",200))


        
        const paystackResponse = await axios.post(`${url}/transfer`,details,config)

        const withdrawal = { 
            user: _id,
            amount,
            withdrawal_status:"pending",
            reference:paystackResponse.data.data.reference
        }

        const newWithdrawal = await WithdrawalModel.create(withdrawal);

        user.walletBalance = user.walletBalance - withdrawalAmount;
        user.save();

        return res.status(200).json({
            success: true,
            newWithdrawal
        })

    } catch (error) {
        return next(error)
    }
}

export const getWithdrawalHistory = async(req,res,next)=>{

    const {id} = req.user;

    try {  
        
        const history = await WithdrawalModel.find({user:id})

        return res.status(200).json({
            success: true,
            history
        })

    } catch (error) {
        return next(error)
    }
}