const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
	const value = err.message.match(/(["'])(\\?.)*?\1/)[0];

	const message = `Duplicate field value: ${value}. Please use another value!`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = err => {

	console.log(err);

	const errors = Object.values(err.errors).map(el => el.message);

	const message = `Invalid input data. ${errors.join('. ')}`;
	return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	let error = { ...err };
	error.message = err.message;

	if (err.name === 'CastError') error = handleCastErrorDB(error);
	if (error.code === 11000) error = handleDuplicateFieldsDB(error);
	if (err.name === 'ValidationError') error = handleValidationErrorDB(error);


	res.status(err.statusCode).json({
		status: error.status,
		message: error.message
	});
};