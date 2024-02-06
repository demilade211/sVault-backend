var crypto = require('crypto');
var secret = process.env.SECRET_KEY;
import WithdrawalModel from "../models/withdrawal"
import UserModel from "../models/user"
import PaymentModel from "../models/payment"
import axios from "axios"
import dotenv from "dotenv";

dotenv.config({ path: "config/config.env" });

const url = 'https://api.paystack.co';

const config = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRETE_KEY_TEST}`
    }
}

export const getWebhook = async (req, res, next) => {
    // Retrieve the request's body
    var event = req.body;
    // Do something with event 
    console.log(event.event, event.data, "=====================================>");
    if (event.event === "charge.success") {
        try {

            if (!event.data.plan.plan_code) {
                const user = await UserModel.findOne({ email: event.data.customer.email })

                console.log(user);

                switch (event.data.amount / 100) {
                    case 1000:
                        user.tcBalance = user.tcBalance + 100
                        await user.save();
                        break;
                    case 3000:
                        user.tcBalance = user.tcBalance + 300
                        await user.save();
                        break;
                    case 10000:
                        user.tcBalance = user.tcBalance + 1000
                        await user.save();
                        break;
                    case 40000:
                        user.tcBalance = user.tcBalance + 4000
                        await user.save();
                        break;
                    default:
                        user.tcBalance = user.tcBalance + 0
                        await user.save();
                        break;
                }

                const payment = {
                    user: user._id,
                    amount: event.data.amount,
                    reference: event.data.reference
                }

                const newPayment = await PaymentModel.create(payment);

                const authorizationExists = user.authorizations.length > 0 && user.authorizations.filter(auth => auth.authorization.signature === event.data.authorization.signature).length > 0;

                if (!authorizationExists) {
                    await user.authorizations.unshift({ email: event.data.customer.email, authorization: event.data.authorization })
                    await user.save()
                }
            }


        } catch (error) {
            console.log(error);
        }
    }


    if (event.event === "transfer.success") {
        try {
            let profileFields = {
                withdrawal_status: "successful"
            };

            await WithdrawalModel.findOneAndUpdate({ reference: event.data.reference }, { $set: profileFields }, { new: true })
        } catch (error) {

        }
    }
    if (event.event === "transfer.failed") {
        try {
            let profileFields = {
                withdrawal_status: "failed"
            };

            const withdrawal = await WithdrawalModel.findOneAndUpdate({ reference: event.data.reference }, { $set: profileFields }, { new: true })
            const user = await UserModel.findById(withdrawal.user)

            user.walletBalance = user.walletBalance + Number(event.data.amount) / 100
            await user.save()
        } catch (error) {
            console.log(error);
        }
    }
    if (event.event === "transfer.reversed") {
        try {
            let profileFields = {
                withdrawal_status: "reversed"
            };

            const withdrawal = await WithdrawalModel.findOneAndUpdate({ reference: event.data.reference }, { $set: profileFields }, { new: true })
            const user = await UserModel.findById(withdrawal.user)

            user.walletBalance = user.walletBalance + Number(event.data.amount) / 100
            await user.save()
        } catch (error) {
            console.log(error);
        }
    }

    return res.status(200).json({
        success: true,
        event
    })
}
