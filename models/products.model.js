const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    id: {
        type: String,
        required: true
    },
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    }
   
});


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
});

const productSchema = new Schema({
    id: {
        type: String,
        required: true,
        default: `PDT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,
        unique: true,
        immutable: true
    },
    productName: {
        type: String,
        required: true
    },
    
    slug: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true,
        default: 'draft',
        enum: ['draft', 'published']
    },
    
        sellPrice: {
            type: Number,
            required: true
        },
       listPrice: {
            type: Number,
            required: true
        },
        ManafacturingCost: {
            type: Number,
            required: true
        },
        ShippingCost: {
            type: Number,
            required: true
        },
        MarkrtingCost: {
            type: Number,
            required: true
        },
        ShippingCharge: {
            type: Number,
            required: true
        },
        CODCharge : {
            type: Number,
            required: true
        }, 
    WhatsappNo : {
        type: Number,
        minLength: 10,
        maxLength: 10,
        default: 9510457831
    },
    ManafacturingName: {
        type: String,
    },
    featuredImage: {
        type: String,
        required: true
    },
    metaTitle: {
        type: String,
        required: false
    },
    MetaDescription: {
        type: String,
        required: false
    },

    description: {
        type: String,
        required: true
    },
    productInfo: {
        type: String,
        required: true
    },
    note: String,
    sticky: {
        order: String,
        isSticky: Boolean
    },
    productGallery: [String],
    category: [categorySchema],
    stock: {
        outOfStock: {
            type: Boolean,
            default: false
        },
        inStock: {
            type: Boolean,
            default: false
        },
        quantity: Number
    },
        colors: {
            type: String,
            required: true
        },
        sizes: {
            type: String,
            required: true,
            enum: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl']
        },
        qty: {
            type: String,
            required: true
        },
        weight: {
            type: String,
            required: true
        },
        occassion: {
            type: String,
            required: true
        },
        pattren: {
            type: String,
            required: true
        },

    // productData: Object,
    reviews: [reviewSchema],
   
     numReviews: {
       type: Number,
       required: true,
       default: 0,
     },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    reviewsId: {
        type: String,
        requried: true,
        default: `RV-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`,
        unique: true,
        immutable: true
    },
  
    // relatedProducts: [Schema.Types.ObjectId]
}, {timestamps: true});
reviewSchema.pre('save', function(next) {
    Math.round(this.rating);
    next();
  });

const Product = mongoose.model('product', productSchema);

module.exports = Product;