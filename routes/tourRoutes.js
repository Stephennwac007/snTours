const express = require("express");
const {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
  checkID,
  checkBody,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter = require("./../routes/reviewRoutes");

const router = express.Router();

// router.param("id", checkID);

router.route("/top-5-tours").get(aliasTopTours, getAllTours);

router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);

//TOUR ROUTES
router
  .route("/")
  .get(authController.protect, getAllTours)
  .post(authController.protect, createTour);

router
  .route("/:id")
  .get(authController.protect, getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    deleteTour
  );

// POST /tours/:tourId/reviews
// GET /tours/:tourId/reviews

router.use("/:tourId/reviews", reviewRouter);

// GET /tours/:tourId/reviews/:reviewId


// router
//   .route("/:id/reviews")
//   .post(
//     authController.protect,
//     authController.restrictTo("user"),
//     reviewController.createReview
//   );

module.exports = router;

// chapter 12
