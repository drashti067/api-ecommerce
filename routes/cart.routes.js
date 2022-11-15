const router = require("express").Router();
const { getCart, addToCart, removeFromCart } = require("../controllers/cart.controller");
const { UserAuthCheck } = require("../middleware/auth.middleware");

router.get('/:id',  getCart);
router.post('/:id',  addToCart);
router.delete('/:id',  removeFromCart);
// router.post('/login-admin', adminLogin);
// router.post('/change-password', UserAuthCheck, changePassword);

module.exports = router;