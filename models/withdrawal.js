import mongoose from "mongoose";

const Schema = mongoose.Schema;


const WithdrawalSchema = new Schema({ 
    user:{
        type: Schema.Types.ObjectId,//gets the  _id from user model
        ref: "User",
        required: true,
    },
    amount:{
        type: Number,
        required:true
    },
    withdrawal_status:{
        type:String,
        enum:['pending','successful','failed','wrong'],
        required:true,
    },
    reference:{
        type:String,
        required: true
    },
    atmReference:{
        type:String,
        required: true
    }
})

module.exports = mongoose.model("Withdrawal", WithdrawalSchema)
