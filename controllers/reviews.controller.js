const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const validateID = require('../utils/validateId');
const Review = require('../models/reviews.model');

exports.getReviews = catchAsync(async (req, res, next) => {
    const find = {};

	if(req.query.userId) find.userId = req.query.userId;

    let fields;
    const queryFields = req.query.fields;
    if (queryFields) fields = queryFields.split(',').join(' ');

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = parseInt(req.query.sort) || -1;
    const skip = (page - 1) * limit;

    const totalDocuments = await Review.estimatedDocumentCount();
    const reviews = await Review.find(find).skip(skip).limit(limit).select(fields).sort({ _id: sort });
    const totalPages = totalDocuments / page;

    if (page > totalPages) return next(new AppError('Page does not exists.', 404));
    if (!reviews || _.isEmpty(reviews)) return next(new AppError('No reviews were found.', 404));

    res.json(reviews);
});

exports.getReviewById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const queryFields = req.query.fields;

    if (!id) return next(new AppError('No id specified to query.', 400));
    if (!validateID(id)) return next(new AppError(`Not valid id: ${id}`, 406));

    let fields;
    if (queryFields) fields = queryFields.split(',').join(' ');

    const review = await Review.findById(id, fields);

    if (!review) return next(new AppError(`No document with this id: ${_id}`, 404));

    res.json(review);
});

exports.addReviews = catchAsync(async (req, res, next) => {
    const data = req.body;
    const { rating, message, name, userId ,productId} = data;

    if(!userId) return next(new AppError('user id is required.'));
    if(!productId) return next(new AppError('product Id is required. '))
	if(!name) return next(new AppError('name is required.'));
	if(!message) return next(new AppError('maessage is required.'));
	if(!rating) return next(new AppError('rating is required required.'));
	if(rating < 1) return next(new AppError('rating must be between 1 to 5'));
	if(rating > 5) return next(new AppError('rating must be between 1 to 5'));

    data.id = `RV-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;

  

    const review = await Review.create(data);

    res.json({
        status: 'success',
        message: 'Dodument added successfully.',
        result: review
    });
});

exports.updateReview = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;

    if (!id) return next(new AppError('No id was provided.', 400))
    if(data.id) delete data.id;

    const review = await Review.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!review) return next(new AppError('No review found with this id.', 404));

    res.json({
        status: 'success',
        message: 'Dodument updated successfully.',
        result: review
    });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id) return next(new AppError('No id was provided.', 400));

    const review = await Review.findByIdAndDelete(id);
    if (!review) return next(new AppError('No review found with this id.', 404));

    res.json({
        status: 'success',
        message: 'Dodument deleted successfully.',
        result: review
    });
});