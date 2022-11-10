const express = require("express");

const {
  getAllReview,
  createReview,
  deleteReview,
  updateReview,
  setTourAndUserIds,
  getReview
} = require("../controllers/reviewController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });


// POST /tour/:tourId/reviews
// POST /reviews

router
  .route("/")
  .get(getAllReview)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    setTourAndUserIds,
    createReview
  );
router.route("/:id").get(getReview).delete(deleteReview).patch(updateReview)

module.exports = router;
