import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        maxlength: [30, "Your name cannot exceed 30 characters"]

    }, 
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,// cant have more than one if this
        validate: [validator.isEmail, 'Please enter valid email address']
    }, 
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Your password must be longer than 6 characters'],
        select: false
    }, 
    verified: {
        type: Boolean,
        default: false
    },
    isDeactivated: {
        type: Boolean,
        default: false
    }, 
    role: {
        type: String,
        default: "user",
        enum: ['user', 'admin']// specifies the only values that will be in role
    },  
    resettoken: { type: String },
    expiretoken: { type: Date },
    authorizations:[]
},
    { timestamps: true });

// Encrypting password before saving user
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {// a check to confirm if the password is modified before encrypting it
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

module.exports = mongoose.model("User", UserSchema);