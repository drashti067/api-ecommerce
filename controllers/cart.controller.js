const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const validateID = require('../utils/validateId');
const User = require('../models/users.model');
const { create } = require('lodash');


// collection product checkout cart 404 thankyou

exports.getCart = catchAsync(async (req, res, next) => {
	const { id } = req.params;

    if (!id) return next(new AppError('No id specified to query.', 400));
    if (!validateID(id)) return next(new AppError(`Not valid id: ${id}`, 406));

    const cart = await User.findById(id, 'cart');
    if (!cart) return next(new AppError(`No document with this id: ${id}`, 404));

    res.json({
        staus: 'success',
        message: 'Document found.',
        result: cart.cart
    });
});

exports.addToCart = catchAsync(async (req, res, next) => {
    const { id } = req.params;
 
    const product = req.body;

    if (!id) return next(new AppError('No id specified to query.', 400));
    if (!validateID(id)) return next(new AppError(`Not valid id: ${id}`, 406));

	if(!product._id) return next(new AppError('enter product id.', 400));
	if(!validateID(product._id)) return next(new AppError(`Not valid product id: ${id}`, 406));
	if(!product.id) return next(new AppError('enter product id.', 400));
	if(!product.quantity) return next(new AppError('enter product quantity.', 400));

	//Logic to update the cart.
	//Logic to update the cart.
	//Logic to update the cart.
	//Logic to update the cart.
	//Logic to update the cart.
	//Logic to update the cart.
	//Logic to update the cart.
	//Logic to update the cart.
    //Logic to update the cart.
   
    
    const cart = await User.findByIdAndUpdate(id, { $push: { "cart.products": product } }, {new: true});
   console.log(cart)

    if (!cart) return next(new AppError(`No document with this id: ${id}`, 404));
    res.json({
        staus: 'success',
        message: 'Document found.',
        result: cart.cart
    });
});



exports.removeFromCart = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const {_id} = req.body;

	if (!id) return next(new AppError('No id specified to query.', 400));
    if (!validateID(id)) return next(new AppError(`Not valid id: ${id}`, 406));

	if(!_id) return next(new AppError('enter product id.', 400));
	if(!validateID(_id)) return next(new AppError(`Not valid product id: ${id}`, 406));

	const cart = await User.findByIdAndUpdate(id, { $pull: { "cart.products": {_id} } }, {new: true});
    if (!cart) return next(new AppError(`No document with this id: ${id}`, 404));

	res.json({
        staus: 'success',
        message: 'Document found.',
        result: cart.cart
    });
});

