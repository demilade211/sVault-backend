const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaidCreatorSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,//gets the  _id from user model
        ref: "User",
        required: true,
    },
    account_name:{
        type: String,
        required: true,
    },
    account_number:{
        type: String,
        required: true,
    },
    bank_name:{
        type: String,
    },
    bank_code:{
        type: String,
        required: true,
    },
    recipient_code:{
        type: String,
        required: true,
        unique:true
    },
    plan_code:{
        type: String,
        required: true,
        unique:true
    },
    subscription_amount:{
        type: String,
        required: true, 
    }
})

module.exports = mongoose.model("PaidCreator", PaidCreatorSchema);