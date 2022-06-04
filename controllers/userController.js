const user = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
	const users = await user.find();

	//send response
	res.status(200).json({
		status: "success",
		results: users.length,
		data: {
			users,
		},
	});
});

exports.getUser = (req, res) => {
	res.status(500).send({
		status: "error",
		message: "this route is not yet defined",
	});
};

exports.createUser = (req, res) => {
	res.status(500).send({
		status: "error",
		message: "this route is not yet defined",
	});
};

exports.updateUser = (req, res) => {
	res.status(500).send({
		status: "error",
		message: "this route is not yet defined",
	});
};

exports.deleteUser = (req, res) => {
	res.status(500).send({
		status: "error",
		message: "this route is not yet defined",
	});
};