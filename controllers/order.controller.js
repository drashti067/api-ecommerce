const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const validateID = require('../utils/validateId');
const Order = require('../models/orders.model');

exports.getOrders = catchAsync(async (req, res, next) => {
    const {userId, phoneNumber, email} = req.query;

    const find = {};

    if(userId) find['user._id'] = userId;
    if(phoneNumber) find['user.phoneNumber'] = phoneNumber;
    if(email) find['user.email'] = email;

    let fields;
    const queryFields = req.query.fields;
    if (queryFields) fields = queryFields.split(',').join(' ');

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = parseInt(req.query.sort) || -1;
    const skip = (page - 1) * limit;

    const totalDocuments = await Order.estimatedDocumentCount();
    const orders = await Order.find(find).skip(skip).limit(limit).select(fields).sort({ _id: sort });
    const totalPages = totalDocuments / page;

    if (page > totalPages) return next(new AppError('Page does not exists.', 404));
    if (!orders || _.isEmpty(orders)) return next(new AppError('No orders were found.', 404));

    res.json({
        staus: 'success',
        message: 'Documents found.',
        totalPages,
        result: orders
    });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const queryFields = req.query.fields;

    if (!id) return next(new AppError('No id specified to query.', 400));
    if (!validateID(id)) return next(new AppError(`Not valid id: ${id}`, 406));

    let fields;
    if (queryFields) fields = queryFields.split(',').join(' ');

    const order = await Order.findById(id, fields);

    if (!order) return next(new AppError(`No document with this id: ${_id}`, 404));

    res.json({
        staus: 'success',
        message: 'Document found.',
        result: order
    });
});

exports.addOrders = catchAsync(async (req, res, next) => {
    const data = req.body;
    const { totalPrice, paymentMethod, guestCheckout, user, products } = data;

    if (!totalPrice) return next(new AppError('Order total price is required.', 400));
    if (!paymentMethod) return next(new AppError('Payment method is required.', 400));
    if (!guestCheckout) return next(new AppError('Checkout type is required.', 400));
	if(_.isEmpty(products)) return next(new AppError('At least on product is required'));

	if(guestCheckout === false && !user._id) return next(new AppError('User _id is required.', 400));
	if(guestCheckout === false && !user.id) return next(new AppError('User id is required.', 400)); 

    data.id = `ORD-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;

    const product = await Order.create(data);

    res.json({
        status: 'success',
        message: 'Dodument added successfully.',
        result: product
    });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;

    if (!id) return next(new AppError('No id was provided.', 400));
    if(data.id) delete data.id;

    const order = await Order.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!order) return next(new AppError('No order found with this id.', 404));

    res.json({
        status: 'success',
        message: 'Dodument updated successfully.',
        result: order
    });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id) return next(new AppError('No id was provided.', 400));
    if (!validateID(id)) return next(new AppError(`Not valid id: ${id}`, 406));

    const order = await Order.findByIdAndDelete(id);
    if (!order) return next(new AppError('No order found with this id.', 404));

    res.json({
        status: 'success',
        message: 'Dodument deleted successfully.',
        result: order
    });
});