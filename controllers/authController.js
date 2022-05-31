const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};
exports.signup = catchAsync(async (req, res, next) => {
	const newUser = await User.create(req.body);
	// token creation
	signToken(newUser._id);

	res.status(201).send({
		status: "success",
		token,
		data: {
			user: newUser,
		},
	});
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// check if email and password exist
	if (!email || !password) {
		return next(new AppError("Please provide email and password", 400));
	}
	// check if user exists and password is correct
	const user = await User.findOne({ email }).select("+password");

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError("Incorrect email or password", 401));
	}

	// if everything is ok, send token to client
	const token = signToken(user._id);
	res.status(200).json({
		status: "success",
		token,
	});
});

exports.protect = catchAsync(async (req, res, next) => {
	//1 Getting token and check if it's there
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1]; // Bearer token
	}
	// console.log(token);
	if (!token) {
		return next(
			new AppError(
				"You are not logged in! Please log in to get authorized access.",
				402
			)
		);
	}
	//2 verify the token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	// console.log(decoded);
	//3 check if user still exists
	const freshUser = await User.findById(decoded.id);
	if (!freshUser)
		return next(
			new AppError("The user belonging to this token does no longer exist", 401)
		);

	//4 check if user changed password after the token was issued

	next();
});
