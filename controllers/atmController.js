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
    const { pin } = req.body;
    try {
        const atm = await AtmModel.findById(atmId).populate('user') 

        if (!atm) return next(new ErrorHandler("Atm not found", 404))

        if (Number(pin) !== atm.pin) return next(new ErrorHandler("Pin Incorrect", 200))

        return res.status(200).json({
            success: true,
            message:"Correct pin"
        })

    } catch (error) {
        return next(error)
    }
}
