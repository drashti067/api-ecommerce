const router = require("express").Router();
const { getImages, uploadImage, deleteImage } = require("../controllers/gallery.controller");
const { AdminAuthCheck } = require("../middleware/auth.middleware");

router.get('/get-images', getImages);
router.post('/add-image', AdminAuthCheck, uploadImage);
router.delete('/:slug', AdminAuthCheck, deleteImage);

module.exports = router;