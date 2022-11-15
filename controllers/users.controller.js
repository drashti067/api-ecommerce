const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const validateID = require('../utils/validateId');
const User = require('../models/users.model');

exports.getUsers = catchAsync(async (req, res, next) => {
    const find = {};

    let fields;
    const queryFields = req.query.fields;
    if (queryFields) fields = queryFields.split(',').join(' ');

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = parseInt(req.query.sort) || -1;
    const skip = (page - 1) * limit;

    const totalDocuments = await User.estimatedDocumentCount();
    const users = await User.find(find).skip(skip).limit(limit).select(fields).sort({ _id: sort });
    const totalPages = totalDocuments / page;

    if (page > totalPages) return next(new AppError('Page does not exists.', 404));
    if (!users || _.isEmpty(users)) return next(new AppError('No users were found.', 404));

    res.json({
        staus: 'success',
        message: 'Documents found.',
        totalPages,
        result: users
    });
});

exports.getUserById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const queryFields = req.query.fields;

    if (!id) return next(new AppError('No id specified to query.', 400));
    if (!validateID(id)) return next(new AppError(`Not valid id: ${id}`, 406));

    let fields;
    if (queryFields) fields = queryFields.split(',').join(' ');

    const user = await User.findById(id, fields);
    if (!user) return next(new AppError(`No document with this id: ${id}`, 404));
	if(user.status === 'banned') return next(new AppError('user have been banned or removed', 403));

    res.json({
        staus: 'success',
        message: 'Document found.',
        result: user
    });
});

exports.addUsers = catchAsync(async (req, res, next) => {
    const data = req.body;
    const { mobile, password, email } = data;
    if(!mobile && !email) return next(new AppError('mobile number is required.', 400));
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

exports.updateUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;

    if (!id) return next(new AppError('No id was provided.', 400));
	if (!validateID(id)) return next(new AppError(`Not valid id: ${id}`, 406));

	// if(!data.firstName) return next(new AppError('user first name is required.', 406));
	// if(!data.lastName) return next(new AppError('user last name is required.', 406));
	// if(!data.email) return next(new AppError('user email is required.', 406));
	// if(!data.address || _.isEmpty(data?.address)) return next(new AppError('user address is required.', 406));

	if(data?.id) delete data.id;
	if(data?.cart?.id) delete data.cart.id;
	if(data?.role) delete data.role;
	if(data?.password) delete data.password;

    if(_.isEmpty(data)) return next(new AppError('Invalid request.', 406));

    const user = await User.findByIdAndUpdate(id, data, { new: true });
    if (!user) return next(new AppError('No user found with this id.', 404));

    res.json({
        status: 'success',
        message: 'Document updated successfully.',
        result: user
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id) return next(new AppError('No id was provided.', 400));
    if (!validateID(id)) return next(new AppError(`Not valid id: ${id}`, 406));

    const user = await User.findByIdAndDelete(id);
    if (!user) return next(new AppError('No user found with this id.', 404));

    res.json({
        status: 'success',
        message: 'Document deleted successfully.',
        result: user
    });
});

