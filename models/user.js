import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        maxlength: [30, "Your name cannot exceed 30 characters"]

    },
    dateOfBirth: {
        type: Date,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,// cant have more than one if this
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    username: {
        type: String,
        unique: true,
        trim: true,// no spaces
    },
    phoneNumber: {
        type: String,
        minlength: [11, 'Your phone number must be at least 11 characters'],
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Your password must be longer than 6 characters'],
        select: false
    },
    coverPhoto: {
        public_id: {
            type: String,
            default: "defaultCover_oa5lkw"
        },
        url: {
            type: String,
            default: 'https://res.cloudinary.com/tuale-tech/image/upload/v1676818436/defaultCover_oa5lkw.png'
        }
    },
    avatar: {
        public_id: {
            type: String,
            default: "App/user_mklcpl.png"
        },
        url: {
            type: String,
            default: 'https://res.cloudinary.com/indersingh/image/upload/v1593464618/App/user_mklcpl.png'
        }
    },
    interests: {
        type: [String]
    },
    unreadMessage: {
        type: Boolean,
        default: false
    },
    unreadNotification: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    isDeactivated: {
        type: Boolean,
        default: false
    },
    walletBalance: {
        type: Number,
        default: 0
    },
    tcBalance: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: "fan",
        enum: ['fan','creator', 'admin']// specifies the only values that will be in role
    },
    useTualeAs: {
        type: String,
        default: "fan",
        enum: ['fan', 'creator','both']// specifies the only values that will be in role
    },
    country: {
        type: String,
        default: "Nigeria"
    },
    blockedUser: [{ user: { type: Schema.Types.ObjectId, ref: "User" } }],
    isBlockedBy: [{ user: { type: Schema.Types.ObjectId, ref: "User" } }],
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