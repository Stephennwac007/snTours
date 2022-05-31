const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "A tour must have a name"],
			unique: true,
			trim: true,
			maxLength: [
				40,
				"A tour name must have less than or equal than 40 characters",
			],
			minLength: [
				10,
				"A tour name must have more than or equal than 10 characters",
			],
			// validate: [
			// 	validator.isAlpha,
			// 	"Tour name must only contain alpha characters",
			// ],
		},
		slug: String,
		duration: {
			type: Number,
			required: [true, "A tour must have a duration"],
		},
		maxGroupSize: {
			type: Number,
			required: [true, "A tour must have a group size"],
		},
		difficulty: {
			type: String,
			required: [true, "A tour must have a difficulty"],
			enum: {
				values: ["easy", "medium", "difficult"],
				message: "Difficulty must be either: easy, medium, or difficult",
			},
		},
		ratingsAverage: {
			type: Number,
			default: 4.5,
			min: [1, "Rating must be above 1.0"],
			max: [5, "Rating must be below 5.0"],
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			required: [true, "A tour must have a price"],
		},
		priceDiscount: {
			type: Number,
			validate: {
				validator: function (val) {
					// this only points to current doc on NEW doc creation or post method
					return val < this.price; //if the pricediscount is GT the price then return a validation-error
				},
				message: "Discount price ({VALUE}) must should be below the price",
			},
		},
		summary: {
			type: String,
			trim: true,
			required: [true, "A tour must have a description"],
		},
		description: {
			type: String,
			trim: true,
		},
		imageCover: {
			type: String,
			required: [true, "A tour must have a cover image"],
		},
		images: [String],
		createdAt: {
			type: Date,
			default: Date.now(),
			select: false,
		},
		startDates: [Date],
		secretTour: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);
//this durationWeeks is not part of the main model but can be virtually displayed in the object

// 4 types of middlewares in mongoose are: document, query, aggregate, model middlewares.
tourSchema.virtual("durationWeeks").get(function () {
	return this.duration / 7;
});

// DOCUMENT MIDDLEWARE:
// the pre() runs on before .save() and .create()
tourSchema.pre("save", function (next) {
	// console.log(this);
	this.slug = slugify(this.name, { lower: true });
	next();
});

// tourSchema.post('save', function (doc, next) {
// 	console.log(doc);
// 	next();
// })

// QUERY MIDDLEWARE
// tourSchema.pre("find", function (next) {
// /^find/ means all the strings that start with find
tourSchema.pre(/^find/, function (next) {
	this.find({ secretTour: { $ne: true } });
	next();
});

tourSchema.post(/^find/, function (doc, next) {
	console.log(`Query took ${Date.now() - this.start} milliseconds!`);
	// console.log(doc);
	next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
	this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
	next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
