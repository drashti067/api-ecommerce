// require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync'	);
const AppError = require('../utils/appError');
const User = require('../models/users.model');
const validateID = require('../utils/validateId');
const { encrypt } = require('../utils/crypto');

exports.login = catchAsync(async (req, res, next) => {
	const {mobile} = req.body;

	if(!mobile) return next(new AppError("mobile number is required"));
	const user = await User.findOne({mobile});
	if(!user) return next(new AppError("Invalid mobile number."));

	if(user.role === 'administrator') return next(new AppError("Invalid mobile number."));

	let token = jwt.sign({ id: user.mobile }, process.env.JWT_SECRET, {expiresIn: "21d"});

	token = encrypt(token);

	res.cookie("cwtct", token, {
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20), //20 Days
		// httpOnly: true,
		// secure: process.env.NODE_ENV !== "development",
		// sameSite: 'none'
	});

	res.json({
		status: 'success',
		message: 'login in success',
		token,
		result: user
	});
});

exports.signup = catchAsync(async (req, res, next) => {
    const data = req.body;
    const { mobile, password, email } = data;

    if(!mobile && !email) return next(new AppError('mobile is required.', 400));
    if(password && password.length < 8) return next(new AppError('Password must be 8 digit long.', 400));
    if(password && password.length > 32) return next(new AppError('Password should not be longer than 32 digit.', 400));
	
    data.id = `USR-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;
    data.cart = data.cart || {};
	data.cart.id = `CRT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;

    const user = await User.create(data);

    res.json({
        status: 'success',
        message: 'Document added successfully.',
        result: user
    });
});

exports.logout = catchAsync(async (_, res) => {
	res.cookie("cwtct", '', {
		expires: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20), //20 Days
		// httpOnly: true,
		// secure: process.env.NODE_ENV !== "development",
		// sameSite: 'none'
	});
});

exports.adminLogin = catchAsync(async (req, res, next) => {
	const {email, password} = req.body;

	if(!email) return next(new AppError("Email is required"));
	if(!password) return next(new AppError("Password is required"));

	const user = await User.findOne({email}).select('+password');
	if(!user) return next(new AppError("Invalid credentials. Check Email & Password"));

	const valid = await bcrypt.compare(password, user.password);
	
	if(!valid) return next(new AppError("Invalid credentials. Check Email & Password"));

	let token = jwt.sign({ id: {email: user.email, password: user.password} }, process.env.JWT_SECRET, {expiresIn: "21d"});
	
	if(!token) return next(new AppError("Something went wrong. Please try Again."));
	
	token = encrypt(token);
	
	user.password = undefined;

	res.cookie("cwtct", token, {
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20), //20 Days
		// httpOnly: true,
		// secure: process.env.NODE_ENV !== "development",
		// sameSite: 'none'
	});

	res.json({
		status: 'success',
		message: 'login in success',
		token,
		result: user
	});
});

exports.authCheck = catchAsync(async (req, res, next) => {
	const user = req.user;

	if(!user) return next(new AppError("Not Authorised!"));

	user.password && delete user.password;

	res.json({
		status: 'success',
		message: 'user logged in',	
		result: user
	});
});

exports.changePassword = catchAsync(async (req, res, next) => {
	const user = req.user;
	const {newPassword, confirmNewPassWord, currentPassword} = req.body;

	if(!user || !user._id || !validateID(user._id.toString())) return next(new AppError('Not Authorised!'));

	if(!newPassword) return next(new AppError('Provide new password to update'));
	if(!confirmNewPassWord) return next(new AppError('Provide confirm password to update'));
	if(!currentPassword) return next(new AppError('Provide current password to update'));
	if(newPassword.length < 8) return next(new AppError('Password must be grater than 8 digits.'));
	if(newPassword.length > 32) return next(new AppError('Password must be less than 32 digits.'));
	if(newPassword !== confirmNewPassWord) return next(new AppError('password and confirm password are not same.'));

	const authUser = await User.findById(user._id).select('+password');
	if(!authUser) return next(new AppError('Not Authorised!'));

	const valid = await bcrypt.compare(currentPassword, authUser.password);
	if(!valid) throw new Error("Invalid credentials. Please check Email and Password");

	const password = await bcrypt.hash(newPassword, 12);
	await User.findByIdAndUpdate(user._id, {password}, {new: true});

	delete authUser.password;

	res.json({
		status: 'success',
		message: 'password updated successfully',
		result: authUser
	});
});