const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
	id: {
		type: String,
        required: true,
        default: `CST-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,
        unique: true,
        immutable: true
	},
	customerName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
	message: {
        type: String
    },
    phoneNumber: {
        type: String,
        required: true
    }
	

}, {timestamps: true});

const Category = mongoose.model('customer', categorySchema);

module.exports = Category;