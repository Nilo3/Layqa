const User = require("../models/user")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail")
const bcrypt = require("bcryptjs")
const cloudinary = require("cloudinary")

// Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    try {
      const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        resource_type: 'image'
        
      });
  
      const { name, email, password } = req.body;
  
      const user = await User.create({
        name,
        email,
        password,
        avatar: {
          public_id: result.public_id,
          url: result.secure_url
        }
      });
  
      sendToken(user, 200, res);
    } catch (error) {
      next(new ErrorHandler("Error al registrar el usuario", 500));
    }
  });
  


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
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
  
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
  
    if (req.body.name) {
      user.name = req.body.name;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.avatar) {
      const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        resource_type: 'image'
      });
  
      user.avatar = {
        public_id: result.public_id,
        url: result.secure_url
      };
    }
  
    await user.save();
  
    res.status(200).json({
      success: true,
      user
    });
  });
  



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