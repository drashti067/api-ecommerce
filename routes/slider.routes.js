const router = require('express').Router();
const { getSlider, addSlider, deleteSlider } = require('../controllers/slider.controller');
const { AdminAuthCheck } = require('../middleware/auth.middleware');

router.get('/get-slider', getSlider); 
router.post('/addslider', AdminAuthCheck, addSlider);
router.delete('/:slug', AdminAuthCheck, deleteSlider);//ok

module.exports = router;