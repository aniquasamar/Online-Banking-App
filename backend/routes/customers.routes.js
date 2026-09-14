const express = require('express');
const router = express.Router();
const Customers = require('../model/customers.model');
const controller = require('../controller/controller');
const dbService = require('../services/db.service');

router.post('/', (req, res) => controller.createData(req, res, Customers));
// Find customer account details by account number & branch (or query)
// router.post('/find-account', async (req, res) => {
//   try {
//     const { accountNumber, branch } = req.body;
//     let query = { accountNumber: Number(accountNumber) };

//     // If branch is provided, scope search to the branch
//     if (branch) {
//       query.branch = branch;
//     }

//     const customer = await dbService.findOneRecord(query, Customers);

//     if (customer) {
//       return res.status(200).json({
//         message: 'Account details found',
//         data: customer,
//       });
//     } else {
//       return res.status(404).json({
//         message: 'Unable to find account detail',
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       message: 'Internal server error',
//       error: error.message,
//     });
//   }
// });
router.get('/', (req, res) => controller.getData(req, res, Customers));
// router.get('/:id', (req, res) => controller.findOne(req, res, Customers));
router.put('/:id', (req, res) => controller.updateData(req, res, Customers));
router.delete('/:id', (req, res) => controller.deleteData(req, res, Customers));

module.exports = router;