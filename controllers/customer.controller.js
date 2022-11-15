const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const validateID = require('../utils/validateId');
const Customers = require('../models/customer.model');

exports.getCustomers = catchAsync(async (req, res, next) => {
    const find = {};

    let fields;
    const queryFields = req.query.fields;
    if (queryFields) fields = queryFields.split(',').join(' ');

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = parseInt(req.query.sort) || -1;
    const skip = (page - 1) * limit;

    const totalDocuments = await Customers.estimatedDocumentCount();
    const customers = await Customers.find(find).skip(skip).limit(limit).select(fields).sort({ _id: sort });
    const totalPages = totalDocuments / page;

    if (page > totalPages) return next(new AppError('Page does not exists.', 404));

    res.json({
        staus: 'success',
        message: 'Document found.',
        result: customers
    });
});



exports.addCustomers = catchAsync(async (req, res, next) => {
    const data = req.body;
    
    
    const { customerName , email , message , phoneNumber} = data;
    console.log(req.body)
    if (!customerName) return next(new AppError('Customer name is required.', 400));
    if (!email) return next(new AppError('Email is required.', 400));
    if (!message) return next(new AppError('Message is required.', 400));
    if(!phoneNumber) return next(new AppError('phoneNumber is required', 400));
    
  
    data.id = `CAT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;

    const customer = await Customers.create(data);
    

    res.json({
        status: 'success',
        message: 'Dodument added successfully.',
        result: customer
    });
});

