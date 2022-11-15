const router = require('express').Router();
const { getUsers, getUserById, addUsers, updateUser, deleteUser } = require('../controllers/users.controller');
const { UserAuthCheck, AdminAuthCheck } = require('../middleware/auth.middleware');

router.get('/:id', UserAuthCheck, getUserById);
router.patch('/:id', UserAuthCheck, updateUser);
router.get('/admin/:id', AdminAuthCheck, getUserById);
router.patch('/admin/:id', AdminAuthCheck, updateUser);
router.get('/', getUsers);
router.post('/', AdminAuthCheck, addUsers);
router.delete('/:id', AdminAuthCheck, deleteUser);

module.exports = router;