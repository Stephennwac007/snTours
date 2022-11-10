const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./../controllers/handlerFactory");

const filterObj = (obj, ...allowedFields) => {
  // ...allowedFields is a spread operator
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    // Object.keys returns an array of the keys of an object
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   //send response
//   res.status(200).json({
//     status: "success",
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updat{{URL}}api/v1/users/5es, Please use /updateMypassword",
        400
      )
    );
  }

  // Filtering out unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");

  // Update user data that's not password
  const updatedUserData = await User.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUserData,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
// you can't update passwords here
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

// exports.getUser = (req, res) => {
//   res.status(500).send({
//     status: "error",
//     message: "this route is not yet defined",
//   });
// };

// exports.updateUser = (req, res) => {
//   res.status(500).send({
//     status: "error",
//     message: "this route is not yet defined",
//   });
// };

// exports.deleteUser = (req, res) => {
//   res.status(500).send({
//     status: "error",
//     message: "this route is not yet defined",
//   });
// };
