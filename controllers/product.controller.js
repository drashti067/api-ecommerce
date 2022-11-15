const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const validateID = require('../utils/validateId');
const Product = require('../models/products.model');

exports.getProducts = catchAsync(async (req, res, next) => {
    const find = {};

    let fields;
    const queryFields = req.query.fields;
    if (queryFields) fields = queryFields.split(',').join(' ');

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = parseInt(req.query.sort) || -1;
    const skip = (page - 1) * limit;

    const totalDocuments = await Product.estimatedDocumentCount();
    const products = await Product.find(find).skip(skip).limit(limit).select(fields).sort({ _id: sort });
    const totalPages = totalDocuments / page;

    if (page > totalPages) return next(new AppError('Page does not exists.', 404));
    if (!products || _.isEmpty(products)) return next(new AppError('No products were found.', 404));

    res.json({  
        status: 'success',
        message: 'Dodument added successfully.',
        result: products
    });
});

exports.getProductById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const queryFields = req.query.fields;

    if (!id) return next(new AppError('No id specified to query.', 400));
    if (!validateID(id)) return next(new AppError(`Not valid id: ${id}`, 406));

    let fields;
    if (queryFields) fields = queryFields.split(',').join(' ');

    const product = await Product.findById(id, fields);

    if (!product) return next(new AppError(`No document with this id: ${_id}`, 404));

    res.json({  
        status: 'success',
        message: 'Dodument added successfully.',
        result: product
    });
});

exports.getProductBySlug = catchAsync(async (req, res, next) => {
    const { slug } = req.params;
    const queryFields = req.query.fields;

    if (!id) return next(new AppError('No id specified to query.', 400));
    if (validateID(id)) return next(new AppError(`Not valid id: ${id}`, 406));

    let fields;
    if (queryFields) fields = queryFields.split(',').join(' ');

    const product = await Product.findOne({ slug }, fields);

    if (!product) return next(new AppError(`No document with this id: ${_id}`, 404));

    res.json({
        staus: 'success',
        message: 'Document found.',
        result: product
    });
});

exports.getProductByCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const queryFields = req.query.fields;

    if (!id) return next(new AppError('No id specified to query.', 400));
    if (validateID(id)) return next(new AppError(`Not valid id: ${id}`, 406));

    let fields;
    if (queryFields) fields = queryFields.split(',').join(' ');

    const product = await Product.find({ category: { $elemMatch: { id } } }, fields);

    if(!product || _.isEmpty(product)) return next(new AppError(`No documnet were found with category id: ${id}`));

    res.json(product);
});

exports.addProducts = catchAsync(async (req, res, next) => {
    const data = req.body;
  
    const { productName, slug ,featuredImage,sticky } = data;
   
    if (!productName) return next(new AppError('Product name is required.', 400));
    if (!slug) return next(new AppError('Product slug is required.', 400));
    if (!featuredImage) return next(new AppError('Product Primary Image is required.', 400));
    // if (_.isEmpty(category)) return next(new AppError('Alt least one category is required', 400));
    if (sticky?.isSticky === true && !sticky?.order) return next(new AppError('Sticky index is required', 400));
    
    data.slug = _.kebabCase(data.slug);
    
    data.id = `PDT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;
    data.reviewsId = `RV-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;

    const product = await Product.create(data);
    
    res.json({  
        status: 'success',
        message: 'Dodument added successfully.',
        result: product
    });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;

    if (!id) return next(new AppError('No id was provided.', 400));

    if (data.slug) data.slug = _.kebabCase(data.slug);
    if (data.id) delete data.id;

    const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!product) return next(new AppError('No product found with this id.', 404));

    res.json({
        status: 'success',
        message: 'Dodument updated successfully.',
        result: product
    });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id) return next(new AppError('No id was provided.', 400));

    const product = await Product.findByIdAndDelete(id);
    if (!product) return next(new AppError('No product found with this id.', 404));

    res.json({
        status: 'success',
        message: 'Dodument deleted successfully.',
        result: product
    });
});

exports.getCartProducts = catchAsync(async (req, res, next) => {
    const data = req.body;

    if (_.isEmpty(data)) return next(new AppError("Provide Array of Ids to get data."));

    const products = await Product.find({ _id: { $in: data } });
    if (_.isEmpty(products)) return next(new AppError(`No document with provided ids`, 404));

    res.json({
        staus: 'success',
        message: 'Document found.',
        result: products
    });

});



exports.createProductReview = catchAsync(async (req, res) => {
    const { rating, comment } = req.body
  
    const product = await Product.findById(req.params.id)
  
    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      )
  
      if (alreadyReviewed) {
        res.status(400)
        throw new Error('Product already reviewed')
      }
  
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      }
  
      product.reviews.push(review)
  
      product.numReviews = product.reviews.length
  
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length
  
      await product.save()
      res.status(201).json({ message: 'Review added' })
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  })