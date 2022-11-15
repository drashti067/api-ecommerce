const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true,
		immutable: true
	},
	rating: {
		type: Number,
		required: true,
        min: 1,
        max: 5
	},
	message: {
		type: String,
		required: true,
		minLength: 2,
		maxLength: 200
	},
	name: {
		type: String,
		require: true
	},
	userId: {
		type: Schema.Types.ObjectId,
		required: true
	},
	productId : {
		type: String,
		required: true
	}
}, {timestamps: true});
reviewSchema.pre('save', function(next) {
	Math.round(this.rating);
	next();
  });

const Review = mongoose.model('review', reviewSchema);

module.exports = Review;