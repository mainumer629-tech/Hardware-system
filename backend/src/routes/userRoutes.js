const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { listUsers } = require('../controllers/userController');
const router = express.Router();

router.use(authenticate);
router.get('/', authorize(['Admin', 'Manager']), listUsers);

module.exports = router;
