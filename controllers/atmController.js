import UserModel from "../models/user"
import AtmModel from "../models/atm"
import ErrorHandler from "../utils/errorHandler.js";

//To get all products => api/products?keyword=apple
export const getAtm = async (req, res, next) => {

    const { _id } = req.user 

    try {
        const user = await UserModel.findOne({ _id: _id })

        if (!user) return next(new ErrorHandler("User not found", 404))

        const atms = await AtmModel.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate("user") 

 


        return res.status(200).json({
            success: true,
            atms: atms
        })

    } catch (error) {
        return next(error)
    }
}

export const getAtmById = async (req, res, next) => {
    const { atmId } = req.params;
    try {
        const atm = await AtmModel.findById(atmId)
            .populate('user') 

        if (!atm) return next(new ErrorHandler("Atm not found", 404))

        return res.status(200).json({
            success: true,
            atm
        })

    } catch (error) {
        return next(error)
    }
}

export const checkPin = async (req, res, next) => {
    const { atmId } = req.params;
    let { pin } = req.body; // Extract PIN from request body
    try {
        const atm = await AtmModel.findById(atmId).populate('user');

        if (!atm) return next(new ErrorHandler("ATM not found", 404));

        // Remove leading zero from PIN if present
        pin = pin.replace(/^0+/, '');

        // Compare PINs (converted to numbers) after removing leading zeros
        if (Number(pin) !== atm.pin) {
            return next(new ErrorHandler("Incorrect PIN", 200));
        }

        return res.status(200).json({
            success: true,
            message: "Correct PIN"
        });

    } catch (error) {
        return next(error);
    }
}


export const getNameAndMessage = async (req, res, next) => {
    const { atmId } = req.params; 
    try {
        const atm = await AtmModel.findById(atmId).populate('user') 

        if (!atm) return next(new ErrorHandler("Atm not found", 404))
     

        return res.status(200).json({
            success: true,
            name:atm.beneficiaryName,
            customMessage:atm.customMessage,
            createdAt:atm.createdAt 
        })

    } catch (error) {
        return next(error)
    }
}
