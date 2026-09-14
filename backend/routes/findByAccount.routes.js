const express = require('express');
const router = express.Router();
const Customers = require('../model/customers.model');
const controller = require('../controller/controller');

router.post("/",(req,res)=>{
    controller.findByAccountNo(req,res,Customers)
});

module.exports = router;