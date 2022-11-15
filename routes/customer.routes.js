const router = require('express').Router();
const { addCustomers, getCustomers, } = require('../controllers/customer.controller');
const { AdminAuthCheck } = require('../middleware/auth.middleware');

router.get('/get-customer', getCustomers); //ok
router.post('/addccustomers', addCustomers); //ok


module.exports = router;