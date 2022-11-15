const  router = require("express").Router();
const { logout, login, authCheck, changePassword, adminLogin, signup } = require("../controllers/auth.controller");
const { UserAuthCheck, AdminAuthCheck } = require("../middleware/auth.middleware");

router.post('/login', login);
router.post('/signup', signup);
router.post('/login-admin', adminLogin);
router.get('/logout', logout);
router.get('/user', UserAuthCheck, authCheck);
router.get('/administrator', AdminAuthCheck, authCheck);
router.post('/change-password', UserAuthCheck, changePassword);

module.exports = router;