const express = require('express');
const router = express.Router();
const { auth, adminOnly, optionalAuth } = require('../middleware/auth');
const {
  createTransaction,
  handleMidtransNotification,
  getTransactionById,
  getTransactionByOrderId,
  getMyTransactions,
  getAllTransactions
} = require('../controllers/transactionController');

router.post('/create', optionalAuth, createTransaction);

// Public webhook for Midtrans
router.post('/notification', handleMidtransNotification);

router.get('/order/:orderId', getTransactionByOrderId); 
router.get('/my-transactions', auth, getMyTransactions); 
router.get('/getall', adminOnly, getAllTransactions); 
router.get('/:id', getTransactionById); 

module.exports = router;