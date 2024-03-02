import ErrorHandler from "../utils/errorHandler.js"; 
import axios from "axios"
import UserModel from "../models/user"
import AtmModel from "../models/atm.js" 

import dotenv from "dotenv";

dotenv.config({ path: "config/config.env" });

let url = 'https://api.paystack.co';

let secreteKey = process.env.NODE_ENV === "DEVELOPMENT" ? process.env.PAYSTACK_SECRETE_KEY_TEST : process.env.PAYSTACK_SECRETE_KEY_LIVE
let subA = process.env.NODE_ENV === "DEVELOPMENT" ? "ACCT_1rfl6oo7whttogx" : "ACCT_ri4kdzrqk7eqar2"
let splitCode = process.env.NODE_ENV === "DEVELOPMENT" ?"SPL_gnViGPfSqB":"SPL_tssvQHc6fQ"

export const initializePayment = async (req, res, next) => {

    // const paystack = new PayStack(process.env.PAYSTACK_SECRETE_KEY_TEST, process.env.NODE_ENV)

    const { email } = req.user;
    const { amount,beneficiaryName,pin,customMessage,referedBy } = req.body;

    try {

        const user = await UserModel.findOne({ email: email })
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${secreteKey}`
            }
        }

        if (Number(amount) < 1500) return next(new ErrorHandler("Please Minimum amount is 1500", 200))

        const data = {
            amount: Number(amount) * 100,
            email, 
            split_code:splitCode,
            callback_url:`https://www.suprisevault.online/home`,
            //channels:["card"]
        }


        const paystackResponse = await axios.post(`${url}/transaction/initialize`, data, config)
        const { access_code, reference, authorization_url } = paystackResponse.data.data

        if (paystackResponse.data.status !== true) return next(new ErrorHandler(paystackResponse.data.message, 200))

        const newAtm = {
            user: user._id,
            amount: Number(amount)-500,
            reference:reference,
            balance:Number(amount)-500,
            beneficiaryName,
            pin,
            customMessage,
            referedBy
        }

        const newPayment = await AtmModel.create(newAtm);

        return res.status(200).json({
            success: true,
            access_code,
            reference,
            authorization_url
        })

    } catch (error) {
        return next(error)
    }
}


// export const verifyAndAddTualePoints = async (req, res, next) => {
//     const { _id } = req.user;
//     const { reference } = req.body

//     const config = {
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${secreteKey}`
//         }
//     }

//     try {
//         const user = await UserModel.findById(_id);
//         const profile = await ProfileModel.findOne({ user: _id })
//         const pay = await PaymentModel.findOne({ reference })

//         if (!reference) return next(new ErrorHandler("Please input reference number", 200))

//         if (pay) return next(new ErrorHandler("This payment has been verified", 200))

//         const paystackResponse = await axios.get(`${url}/transaction/verify/${reference}`, config)
//         const { status, amount, authorization } = paystackResponse.data.data

//         if (paystackResponse.data.status !== true) return next(new ErrorHandler(paystackResponse.data.message, 200))

//         if (status !== "success") return next(new ErrorHandler("Transaction failed", 200))

//         switch (amount / 100) {
//             case 1000:
//                 user.tcBalance = user.tcBalance + 100
//                 await user.save();
//                 break;
//             case 3000:
//                 user.tcBalance = user.tcBalance + 300
//                 await user.save();
//                 break;
//             case 10000:
//                 user.tcBalance = user.tcBalance + 1000
//                 await user.save();
//                 break;
//             case 40000:
//                 user.tcBalance = user.tcBalance + 4000
//                 await user.save();
//                 break;
//             default:
//                 user.tcBalance = user.tcBalance + 0
//                 await user.save();
//                 break;
//         }

//         const payment = {
//             user: _id,
//             amount,
//             reference: reference
//         }

//         const newPayment = await PaymentModel.create(payment);

//         const authorizationExists = user.authorizations.length > 0 && user.authorizations.filter(auth => auth.authorization_code === authorization.authorization_code).length > 0;

//         if (!authorizationExists) {
//             await user.authorizations.unshift(authorization)
//             await user.save()
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Transaction Sucessfull"
//         })

//     } catch (error) {
//         return next(error)
//     }
// }

export const makeRecurringPayment = async (req, res, next) => {
    const { _id } = req.user;
    const { amount, email, authorization_code,beneficiaryName,pin,customMessage ,referedBy} = req.body

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secreteKey}`
        }
    }

    try {
        const user = await UserModel.findById(_id);

        if (!amount || !email || !authorization_code) return next(new ErrorHandler("Please input reference number", 200))

        const info = {
            amount: Number(amount) * 100,
            email,
            authorization_code,
            split_code:splitCode
        }

        const paystackResponse = await axios.post(`${url}/transaction/charge_authorization`, info, config)
        const { reference } = paystackResponse.data.data
        const newAtm = {
            user: user._id,
            amount: Number(amount)-500,
            reference:reference,
            balance:Number(amount)-500,
            beneficiaryName,
            pin,
            customMessage,
            referedBy
        }

        const newPayment = await AtmModel.create(newAtm);

        return res.status(200).json({
            success: true,
            message: "Transaction Sucessfull",
            data: paystackResponse.data.data
        })

    } catch (error) {
        return next(error)
    }
}