const express = require('express');
const { login, register, loginValidations, registerValidations } = require('../controllers/authController');
const router = express.Router();

router.post('/login', loginValidations, login);
router.post('/register', registerValidations, register);

module.exports = router;
