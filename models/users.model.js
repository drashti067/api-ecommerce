const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const productSchema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
	},
	id: {
		type: String,
	},
	quantity: {
		type: Number,
		min: 1,
	}
});

const addressSchema = new Schema({
	main: String,
	optional: String,
	city: String,
	pincode: Number,
	state: String
});

const userSchema = new Schema({
	id: {
		type: String,
        required: true,
        default: `USR-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,
        unique: true,
        immutable: true
	},
	email: {
		type: String,
		unique: true,
	},
	mobile: {
		type: String,
		required: true,
	
	},
	firstName: String,
	lastName: String,
	profilePhoto: String,
	role: {
		type: String,
		default: 'customer',
		required: true
	},
	status: {
		type: String,
		default: 'active',
		required: true,
		enum: ['active', 'banned']
	},
	password: {
		type: String,
		select: false
	},
	address: [addressSchema],
	cart: {
		id: {
			type: String,
			unique: true,
			required: true,
			default: `CRT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`
		},
		products: [productSchema]
	}
}, {timestamps: true});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

	if(this.password){
		this.password = await bcrypt.hash(this.password, 12);
	}
	next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;