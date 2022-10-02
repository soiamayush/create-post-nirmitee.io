const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken")
const crypto = require("crypto");
const dotenv = require("dotenv")

// setting up config file
dotenv.config({path : "backend/config/config.env"})

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please enter your name"],
        maxlength : [30, "Your name cannot exceed 30 characters"]
    },
    email : {
        type  : String,
        required : [true, "Please enter your email"],
        unique : true,
        validate : [validator.isEmail , "Please enter valid email address"]
    },
    password : {
        type : String,
        required : true,
        minlength : [6, "Your password must be longer than 6 characters"],
        select : false,
    },
    
  
    createdAt : {
        type : Date,
        default : Date.now,
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date,
})

//encrypting password before saving user
userSchema.pre("save", async function (next){
    if(!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10)
});


//compare user password
userSchema.methods.comparePassword =  async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

//returning jwt token

userSchema.methods.getJwtToken = function(){
    return jwt.sign({id : this._id}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_TIME,
    });
}

// generate reset password token
userSchema.methods.getResetPasswordToken = function () {
    //genearte token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //hash and set to reset password token
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    //set token expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000
    
    return resetToken;
}

module.exports = mongoose.model("User", userSchema)