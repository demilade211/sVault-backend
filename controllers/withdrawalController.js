import ErrorHandler from "../utils/errorHandler.js";
import axios from "axios"
import RecipientModel from "../models/recipient"
import WithdrawalModel from "../models/withdrawal"
import AtmModel from "../models/atm"
import UserModel from "../models/user"
import dotenv from "dotenv";

dotenv.config({ path: "config/config.env" });

const url = 'https://api.paystack.co';

let secreteKey = process.env.NODE_ENV === "DEVELOPMENT" ? process.env.PAYSTACK_SECRETE_KEY_TEST : process.env.PAYSTACK_SECRETE_KEY_LIVE

const config = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secreteKey}`
    }
}

export const createWithdrawalAccount = async (req, res, next) => { 
    const { accountNumber, bankCode } = req.body

    try { 

        const paystackRes = await axios.get(`${url}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`, config)

        const name = paystackRes.data.data.account_name

        const reciepient = {
            type: "nuban",
            name,
            account_number: accountNumber,
            bank_code: bankCode,
            currency: "NGN"
        }


        const paystackResponse = await axios.post(`${url}/transferrecipient`, reciepient, config)

        const { recipient_code, details: { account_name, account_number, bank_code, bank_name } } = paystackResponse.data.data





        return res.status(200).json({
            success: true,
            recipient_code,
            reciepient,
        })

    } catch (error) {
        return next(error)
    }
}

export const getBankList = async (req, res, next) => {
    try {

        const paystackResponse = await axios.get(`${url}/bank`, config)


        return res.status(200).json({
            success: true,
            banks: paystackResponse.data.data
        })

    } catch (error) {
        return next(error)
    }
}

export const getWithdrawalAccount = async (req, res, next) => {
    const { _id } = req.user;
    try {

        const withdrawalAccount = await RecipientModel.findOne({ user: _id })

        if (!withdrawalAccount) return next(new ErrorHandler("No withdrawal Account Found", 404))


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

export const makeWithdrawal = async (req, res, next) => {
 
    const { amount, recipient_code } = req.body
    const { atmId } = req.params
    let convertedAmount = Number(amount)
    let withdrawalAmount = 0

    try { 

        const atm = await AtmModel.findOne({ _id: atmId }) 
        

        if (!atm) return next(new ErrorHandler("Atm not found", 200))

        if(!atm.isFunded)return next(new ErrorHandler("No funds in Atm", 200))

        if (convertedAmount <= 5000) withdrawalAmount = convertedAmount + 10

        if (convertedAmount > 5000 && convertedAmount <= 50000) withdrawalAmount = convertedAmount + 25

        if (convertedAmount > 50000) withdrawalAmount = convertedAmount + 50

        if (withdrawalAmount > atm.balance) {
            const withdrawal = { 
                amount,
                withdrawal_status: "wrong",
                reference: "noreference",
                atmReference:"noatmreference"
            }

            const newWithdrawal = await WithdrawalModel.create(withdrawal);
            return next(new ErrorHandler("Balance Insufficient for withdrawal", 200))
        }

        const details = {
            source: "balance",
            amount: Number(amount) * 100,
            recipient: recipient_code
        }
 

        const paystackResponse = await axios.post(`${url}/transfer`, details, config) 

        const withdrawal = { 
            amount,
            withdrawal_status: "pending",
            reference: paystackResponse.data.data.reference,
            atmReference:atm.reference
        }

        const newWithdrawal = await WithdrawalModel.create(withdrawal);

        atm.balance = atm.balance - withdrawalAmount;
        atm.save();

        return res.status(200).json({
            success: true,
            newWithdrawal
        })

    } catch (error) {
        return next(error)
    }
}

export const getWithdrawalHistory = async (req, res, next) => {

    const { id } = req.user;

    try {

        const history = await WithdrawalModel.find({ user: id })

        return res.status(200).json({
            success: true,
            history
        })

    } catch (error) {
        return next(error)
    }
}