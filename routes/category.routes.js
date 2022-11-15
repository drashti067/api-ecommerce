const router = require('express').Router();
const { getCategories, getCategorieById, getCategoryBySlug, addCategories, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { AdminAuthCheck } = require('../middleware/auth.middleware');

router.get('/get-categories', getCategories); //ok
router.get('/:id', getCategorieById);
router.get('/slug/:slug', getCategoryBySlug);
router.post('/addcategory', AdminAuthCheck, addCategories); //ok
router.patch('/:id', AdminAuthCheck, updateCategory);//ok
router.delete('/:id', AdminAuthCheck, deleteCategory);//ok

module.exports = router;