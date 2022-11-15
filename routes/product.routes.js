const router = require('express').Router();
const { getProducts, getProductById, getProductBySlug, addProducts, updateProduct, deleteProduct, getProductByCategory ,getCartProducts ,createProductReview} = require('../controllers/product.controller');
const { AdminAuthCheck } = require('../middleware/auth.middleware');

router.get('/getproduct', getProducts); //ok
router.get('/:id', getProductById); //ok
router.get('/slug/:slug', getProductBySlug);
router.get('/category/:id', getProductByCategory);
router.post('/addproduct', AdminAuthCheck, addProducts); //ok
router.patch('/:id', AdminAuthCheck, updateProduct);//ok
router.delete('/:id', AdminAuthCheck, deleteProduct); //ok
router.post('/addid', AdminAuthCheck, getCartProducts); //ok
router.post('/:id/reviews' ,  createProductReview);
module.exports = router;

