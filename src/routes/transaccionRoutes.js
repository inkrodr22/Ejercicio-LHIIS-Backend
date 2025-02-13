const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transaccionController');

router.get('/transacciones', transaccionController.getAllTransactions);
router.post('/transacciones', transaccionController.createTransaction);
router.put('/transacciones/:id/status', transaccionController.updateTransactionStatus);
router.delete('/transacciones/:id', transaccionController.deleteTransaction);
router.get('/transacciones/resumen/:RFC', transaccionController.getTransactionSummary);

module.exports = router;
