const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
	id: {
		type: String,
        required: true,
        default: `CAT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,
        unique: true,
        immutable: true
	},
	categoryName: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
	featuredImage: {
        type: String
    },
	description: {
        type: String,
    },
	sticky: {
        order: String,
        isSticky: Boolean
    }
}, {timestamps: true});

const Category = mongoose.model('categoty', categorySchema);

module.exports = Category;