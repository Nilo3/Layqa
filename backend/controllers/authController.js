const User = require("../models/user")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail")
const bcrypt = require("bcryptjs")

// Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "avatars/alkdsjadklajd",
            url: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
        }
    })

    sendToken(user, 200, res)


})

// Login User => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const {email, password} = req.body;

    // Check if email and password is entered by user
    if(!email || !password) {
        return next(new ErrorHandler("Please enter email & password", 400))
    }

    // Finding user in database
    const user = await User.findOne({email}).select("+password")

    if(!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    // Check if password is correct or not
    const isPasswordMatched = await user.comparePassword(password)
    
    if(!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    sendToken(user, 200, res)
    
})

// Forgot Password = /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async( req, res, next ) => {

    const user = await User.findOne({ email: req.body .email });

    if(!user){
        return next(new ErrorHandler("User not found with this email", 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();


    // Create reset password url
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is a follow:\n\n${resetUrl}\n\nIf you have not request this email, then ignore it`

    try {
        
        await sendEmail({
            email: user.email,
            subject: "Layqa Password Recovery",
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken =  undefined;
        user.resetPasswordExpire = undefined; 

        await user.save ({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message, 500))
    }
})

// Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async ( req, res, next) => {


    // Hash URL token
    const resetPasswordToken = await bcrypt.hash(req.params.token, 10);
    
    
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    })
  

    if(!user) {
        return next(new ErrorHandler("Password reset token is invalid or has been expired", 400))
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400))
    }

    // Setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user. resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)
})

// Get currently logged in user details => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async(req,res,next)=> {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})


// Update / Change password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async(req,res,next)=> {
    const user = await User.findById(req.user.id).select("+password")

    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if(!isMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400))
    }

    user.password = req.body.password;
    await user.save()

    sendToken(user, 200, res)
})

// Update user profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async(req,res,next)=> {
    const newUserDate = {
        name: req.body.name,
        email: req.body.email
    }

    // Update avatar: TODO

    const user = await User.findByIdAndUpdate(req.user.id, newUserDate, {
        new: true,
        runValidators: true,
        userFindAnfModify: false
    })

    res.status(200).json({
        success: true
    })
})



// Logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged out"
    })
}   
)


// Admin Routes

// Get all users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req,res,next)=> {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})


// Get user details => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
})


// Update user profile => /api/v1/admnin/user/:id
exports.updateUser = catchAsyncErrors(async(req,res,next)=> {
    const newUserDate = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserDate,{
        new: true,
        runValidators: true,
        userFindAnfModify: false
    })
    
    res.status(200).json({
        success: true
    })
})

// Delete user => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    // Remove avatar from cloudinary - TODO

    await user.deleteOne()

    res.status(200).json({
        success: true,
    })
})