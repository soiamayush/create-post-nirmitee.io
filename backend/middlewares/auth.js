const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const dotenv = require("dotenv")


// setting up config file
dotenv.config({path : "backend/config/config.env"})

// checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {

    const { token } = req.cookies;

    if(!token){
        return next(new ErrorHandler("", 401))
    }

    const decoded = jwt.verify(token,  process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
})

//handling users roles
