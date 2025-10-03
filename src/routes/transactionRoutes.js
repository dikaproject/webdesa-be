const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const {
  createTransaction,
  handleMidtransNotification,
  getTransactionById,
  getMyTransactions,
  getAllTransactions
} = require('../controllers/transactionController');

router.post('/create', auth, createTransaction);
router.post('/notification', handleMidtransNotification);
router.get('/my-transactions', auth, getMyTransactions);
router.get('/getall', adminOnly, getAllTransactions);
router.get('/:id', auth, getTransactionById);

module.exports = router;