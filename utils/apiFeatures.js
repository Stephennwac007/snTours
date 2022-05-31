class APIFeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filter() {
		//  1. Filtering
		const queryObj = { ...this.queryString };
		const excludedFields = ["page", "sort", "limit", "fields"];
		excludedFields.forEach((el) => delete queryObj[el]);
		// console.log(req.query, queryObj);

		// 1b. advanced filtering
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
		// console.log(JSON.parse(queryStr));

		//instantiate the query object
		// let query = Tour.find(JSON.parse(queryStr));
		this.query = this.query.find(JSON.parse(queryStr));

		return this;
	}

	sort() {
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(",").join(" ");
			// console.log(sortBy);
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort("-createdAt");
		}

		return this;
	}

	limitFields() {
		if (this.queryString.fields) {
			const fields = this.queryString.fields.split(",").join(" ");
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select("-__v");
		}
		return this;
	}

	paginate() {
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || 100;
		const skip = (page - 1) * limit;

		this.query = this.query.skip(skip).limit(limit);
		// no need for this code down here because if there's no result, it doesn't matter or mean an error occurred .
		// if (req.query.page) {
		// 	const numOfTours = await Tours.countDocuments();
		// 	if (skip >= numOfTours)
		// 		throw new Error("Sorry! This page does not exist");
		// }

		return this;
	}
}

module.exports = APIFeatures;
