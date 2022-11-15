const router = require('express').Router();
const { getReviews, getReviewById, deleteReview, updateReview , addReviews} = require('../controllers/reviews.controller');
const { AdminAuthCheck } = require('../middleware/auth.middleware');

router.get('/get-review', getReviews);
router.get('/:id', getReviewById);
router.patch('/:id', AdminAuthCheck, updateReview);
router.delete('/:id', AdminAuthCheck, deleteReview);
router.post('/addreview', addReviews)

module.exports = router;