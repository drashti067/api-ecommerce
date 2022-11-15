const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sliderSchema  = new Schema({
    name: {
        type: String,
        required: true
    },
	slug: {
		type: String,
        required: true,
		unique: true
	},
    alt: {
        type: String,
        default: "",
    },
    url: {
        type: String,
        required: true
    }
});

const Slider = mongoose.model('slider', sliderSchema);

module.exports = Slider;