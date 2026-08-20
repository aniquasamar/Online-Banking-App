const express = require('express');
const router = express.Router();
const userSchema = require('../model/users.model');
const loginController = require('../controller/login.controller');

router.post('/', (req, res) => loginController.loginFunc(req, res, userSchema));

module.exports = router;