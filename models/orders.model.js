const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		required: true
	},
	id: {
		type: String,
		required: true
	},
	qty: {
		type: Number,
		min: 1,
		required: true
	},
	productName: {
		type: String,
		required: true
	},
	sellPrice: {
		type: Number,
		required: true
	}
});

const orderSchema = new Schema({
	id: {
		type: String,
		required: true,
		default: `ORD-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,
		unique: true,
		immutable: true
	},
	status: {
		type: String,
		required: true,
		default: 'pending',
	},
	products: [productSchema],
	totalPrice: {
		type: Number,
		required: true
	},
	paymentMethod: {
		type: String,
		required: true
	},
	shippingMethod: String,
	discount: String,
	guestCheckout: {
		type: Boolean,
		required: true
	},

		// _id: {
		// 	type: Schema.Types.ObjectId,
		//
		// },
		
		// id: String,
		email: {
			type: String,
			required: true
		},
		mobile: {
			type: String,
			required: true,
			minLength: 10,
			maxLength: 10
		},
		firstName: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
		},
		main: {
			type: String,
			required: true
		},
		optional: {
			type: String,
			required: true
		},
		city: {
			type: String,
			required: true
		},
		pincode: {
			type: Number,
			required: true
		},
		state: {
			type: String,
			required: true

		}

}, { timestamps: true });

const Order = mongoose.model('order', orderSchema);

module.exports = Order;