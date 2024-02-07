import mongoose from "mongoose";

const Schema = mongoose.Schema;


const AtmSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,//gets the  _id from user model
        ref: "User",
        required: true,
    },
    amount:{
        type: Number,
        required:true
    },
    balance:{
        type: Number,
        required:true
    },
    beneficiaryName:{
        type: String,
        required:true
    },
    pin:{
        type: Number,
        required:true
    },
    customMessage:{
        type: String,
        required:true
    },
    reference:{
        type:String,
        required: true
    },
    isFunded:{
        type:Boolean,
        required: true,
        default: false
    },
    referedBy:{
        type:String,
    }
},
{timestamps: true}
)

module.exports = mongoose.model("Atm", AtmSchema)
