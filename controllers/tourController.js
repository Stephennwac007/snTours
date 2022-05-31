const fs = require("fs");
const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
// const tours = JSON.parse(
// 	fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// params middlewares
// exports.checkID = (req, res, next, val) => {
// 	console.log(`tour id is ${val}`);
// 	const id = req.params.id * 1;
// 	const tour = tours.find((el) => el.id === id);
// 	if (id > tours.length || !tour) {
// 		return res.status(404).json({
// 			status: "fail",
// 			message: "Invalid ID",
// 		});
// 	}
// 	next();
// };

// exports.checkBody = (req, res, next) => {
// 	const name = req.body.name;
// 	const price = req.body.price;
// 	if (!name || !price) {
// 		return res.status(400).json({
// 			status: "fail",
// 			message: "Missing price or name",
// 		});
// 	}
// 	next();
// };
exports.aliasTopTours = (req, res, next) => {
	req.query.limit = "5";
	req.query.sort = "-ratingsAverage,price";
	req.query.fields = "name,price,ratingsAverage,summary,difficulty";
	next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
	//build the query
	// //  1. Filtering
	// const queryObj = { ...req.query };
	// const excludedFields = ["page", "sort", "limit", "fields"];
	// excludedFields.forEach((el) => delete queryObj[el]);
	// // console.log(req.query, queryObj);

	// // 1b. advanced filtering
	// let queryStr = JSON.stringify(queryObj);
	// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
	// // console.log(JSON.parse(queryStr));

	// //instantiate the query object
	// let query = Tour.find(JSON.parse(queryStr));

	// 2. sortings for multiple parameters
	// if (req.query.sort) {
	// 	const sortBy = req.query.sort.split(",").join(" ");
	// 	// console.log(sortBy);
	// 	query = query.sort(sortBy);
	// } else {
	// 	query = query.sort("-createdAt");
	// }

	//  3. field limiting
	// if (req.query.fields) {
	// 	const fields = req.query.fields.split(",").join(" ");
	// 	query = query.select(fields);
	// } else {
	// 	query = query.select("-__v");
	// }

	// 4. pagination
	// const page = req.query.page * 1 || 1;
	// const limit = req.query.limit * 1 || 100;
	// const skip = (page - 1) * limit;

	// query = query.skip(skip).limit(limit);
	// if (req.query.page) {
	// 	const numOfTours = await Tours.countDocuments();
	// 	if (skip >= numOfTours)
	// 		throw new Error("Sorry! This page does not exist");
	// }

	//execute the query
	const features = new APIFeatures(Tour.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();
	const tours = await features.query;

	//send response
	res.status(200).json({
		status: "success",
		results: tours.length,
		requestedAt: req.requestTime,
		data: {
			tours,
		},
	});
	// try {
	// } catch (error) {
	// 	res.status(404).json({
	// 		status: "failed",
	// 		message: error,
	// 	});
	// }
});

exports.getTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findById(req.params.id);
	if (!tour) {
		return next(new AppError("No tour found for that id.", 404));
	}
	res.status(200).json({
		status: "success",
		data: {
			tour,
		},
	});
	// try {
	// } catch (error) {
	// 	res.status(404).json({
	// 		status: "failed",
	// 		message: error,
	// 	});
	// }
	// const id = req.params.id * 1;
	// const tour = tours.find((el) => el.id === id);
});

exports.createTour = catchAsync(async (req, res, next) => {
	const newTour = await Tour.create(req.body);
	
	res.status(201).json({
		status: "success",
		data: {
			tour: newTour,
		},
	});

	// try {
	// } catch (err) {
	// 	res.status(400).json({
	// 		status: "failed",
	// 		message: err,
	// 	});
	// }
	// const newId = tours[tours.length - 1].id + 1;
	// const newTour = Object.assign({ id: newId }, req.body);

	// tours.push(newTour);
	// fs.writeFile(
	// `${__dirname}/../dev-data/data/tours-simple.json`,
	// JSON.stringify(tours),
	// (err) => {	}
	// );
});

exports.updateTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!tour) {
		return next(new AppError("No tour found for that id.", 404));
	}
	res.status(200).json({
		status: "success",
		data: {
			tour,
		},
	});
	// try {
	// } catch (err) {
	// 	res.status(400).json({
	// 		status: "failed",
	// 		message: err,
	// 	});
	// }
});

exports.deleteTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findByIdAndDelete(req.params.id);
	if (!tour) {
		return next(new AppError("No tour found for that id.", 404));
	}
	res.status(204).json({
		status: "success",
		data: null,
	});
	// try {
	// } catch (err) {
	// 	res.status(400).json({
	// 		status: "failed",
	// 		message: err,
	// 	});
	// }
});

exports.getTourStats = catchAsync(async (req, res, next) => {
	const stats = await Tour.aggregate([
		{ $match: { ratingsAverage: { $gte: 4.5 } } },
		{
			$group: {
				_id: { $toUpper: "$difficulty" },
				numTours: { $sum: 1 },
				numRatings: { $sum: "$ratingsQuantity" },
				avgRating: { $avg: "$ratingsAverage" },
				avgPrice: { $avg: "$price" },
				minPrice: { $min: "$price" },
				maxPrice: { $max: "$price" },
			},
		},
		{
			$sort: { avgPrice: 1 },
		},
		// {
		// 	$match: {
		// 		_id: { $ne: "EASY" },
		// 	},
		// },
	]);

	res.status(200).json({
		status: "success",
		data: {
			stats,
		},
	});
	// 	try {
	// } catch (err) {
	// 	res.status(400).json({
	// 		status: "failed",
	// 		message: err,
	// 	});
	// }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
	const year = req.params.year * 1;

	const plan = await Tour.aggregate([
		{
			$unwind: "$startDates",
		},
		{
			$match: {
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`),
				},
			},
		},
		{
			$group: {
				_id: { $month: "$startDates" },
				numTourStarts: { $sum: 1 },
				tours: { $push: "$name" },
			},
		},
		{
			$addFields: {
				months: "$_id",
			},
		},
		{
			$project: {
				_id: 0,
			},
		},
		{
			$sort: {
				numTourStarts: -1,
			},
		},
		// {
		// 	$limit: 12
		// }
	]);

	res.status(200).json({
		status: "success",
		data: {
			plan,
		},
	});
	// 		try {
	// } catch (error) {
	// 	res.status(400).json({
	// 		status: "failed",
	// 		message: err,
	// 	});
	// }
});
