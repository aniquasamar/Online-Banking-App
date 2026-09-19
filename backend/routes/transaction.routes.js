const express = require('express');
const router = express.Router();
const Transactions = require('../model/transaction.model');
const controller = require('../controller/controller');
const {verifyToken, isAdmin, isAdminEmployee, isAdminEmployeeCustomer} = require("../middlewares/middleware");

router.post('/', verifyToken, isAdminEmployee, (req, res) => controller.createData(req, res, Transactions));
router.get('/', (req, res) => controller.getData(req, res, Transactions));
router.get('/summary', verifyToken, isAdminEmployeeCustomer, (req, res) => controller.getTransactionSummary(req, res, Transactions));
router.get('/pagination', verifyToken, isAdminEmployeeCustomer, (req, res) =>
    controller.getPaginatedTransactions(req, res, Transactions)
);
// router.get('/:id', (req, res) => controller.findOne(req, res, Transactions));
router.put('/:id', (req, res) => controller.updateData(req, res, Transactions));
router.delete('/:id', (req, res) => controller.deleteData(req, res, Transactions));

module.exports = router;