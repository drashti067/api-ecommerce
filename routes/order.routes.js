const router = require('express').Router();
const { getOrders, getOrderById, addOrders, updateOrder, deleteOrder } = require('../controllers/order.controller');
const { AdminAuthCheck } = require('../middleware/auth.middleware');

router.get('/getOrder', AdminAuthCheck, getOrders);
router.get('/:id', AdminAuthCheck, getOrderById);
router.post('/addneworder', addOrders);
router.patch('/:id', AdminAuthCheck, updateOrder);
router.delete('/:id', AdminAuthCheck, deleteOrder);

module.exports = router;