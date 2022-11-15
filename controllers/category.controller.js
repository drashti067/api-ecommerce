const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const validateID = require('../utils/validateId');
const Category = require('../models/categories.model');

exports.getCategories = catchAsync(async (req, res, next) => {
    const find = {};

    let fields;
    const queryFields = req.query.fields;
    if (queryFields) fields = queryFields.split(',').join(' ');

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = parseInt(req.query.sort) || -1;
    const skip = (page - 1) * limit;

    const totalDocuments = await Category.estimatedDocumentCount();
    const category = await Category.find(find).skip(skip).limit(limit).select(fields).sort({ _id: sort });
    const totalPages = totalDocuments / page;

    if (page > totalPages) return next(new AppError('Page does not exists.', 404));
    if (!category || _.isEmpty(category)) return next(new AppError('No category were found.', 404));

    res.json(category);
});

exports.getCategorieById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const queryFields = req.query.fields;

    if (!id) return next(new AppError('No id specified to query.', 400));
    if (!validateID(id)) return next(new AppError(`Not valid id: ${id}`, 406));

    let fields;
    if (queryFields) fields = queryFields.split(',').join(' ');

    const category = await Category.findById(id, fields);

    if (!category) return next(new AppError(`No document with this id: ${_id}`, 404));

    res.json({
        staus: 'success',
        message: 'Document found.',
        result: category
    });
});

exports.getCategoryBySlug = catchAsync(async (req, res, next) => {
    const { slug } = req.params;
    const queryFields = req.query.fields;

    if (!id) return next(new AppError('No id specified to query.', 400));
    if (validateID(id)) return next(new AppError(`Not valid id: ${id}`, 406));

    let fields;
    if (queryFields) fields = queryFields.split(',').join(' ');

    const category = await Category.findOne({ slug }, fields);

    if (!category) return next(new AppError(`No document with this id: ${_id}`, 404));

    res.json({
        staus: 'success',
        message: 'Document found.',
        result: category
    });
});

exports.addCategories = catchAsync(async (req, res, next) => {
    const data = req.body;
    
    
    const { categoryName, slug, featuredImage, sticky, description } = data;
    console.log(req.body)
    if (!categoryName) return next(new AppError('Product name is required.', 400));
    if (!slug) return next(new AppError('Product slug is required.', 400));
    if (!featuredImage) return next(new AppError('Product Primary Image is required.', 400));
    if (!description) return next(new AppError('Alt least one category is required', 40.));
    if (sticky?.isSticky === true && !sticky?.order) return next(new AppError('Sticky index is required', 400));
  
    data.slug = _.kebabCase(data.slug);
    
    data.id = `CAT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;


    const category = await Category.create(data);
    

    res.json({
        status: 'success',
        message: 'Dodument added successfully.',
        result: category
    });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;

    if (!id) return next(new AppError('No id was provided.', 400));

    if(data.slug) data.slug = _.kebabCase(data.slug);
    if(data.id) delete data.id;

    const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!category) return next(new AppError('No category found with this id.', 404));

    res.json({
        status: 'success',
        message: 'Dodument updated successfully.',
        result: category
    });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id) return next(new AppError('No id was provided.', 400));

    const category = await Category.findByIdAndDelete(id);
    if (!category) return next(new AppError('No category found with this id.', 404));

    res.json({
        status: 'success',
        message: 'Dodument deleted successfully.',
        result: category
    });
});