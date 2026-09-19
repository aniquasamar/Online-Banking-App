const express = require('express');
const router = express.Router();
const Customers = require('../model/customers.model');
const controller = require('../controller/controller');
const dbService = require('../services/db.service');

router.post('/', (req, res) => controller.createData(req, res, Customers));
router.get('/', (req, res) => controller.getData(req, res, Customers));
// router.get('/:id', (req, res) => controller.findOne(req, res, Customers));
router.put('/:id', (req, res) => controller.updateData(req, res, Customers));
router.delete('/:id', (req, res) => controller.deleteData(req, res, Customers));

module.exports = router;