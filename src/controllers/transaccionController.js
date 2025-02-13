const Transaction = require('../models/transaccionModel');

const getAllTransactions = (req, res) => {
    const { fechaInicio, fechaFin, RFC, folio, status } = req.query;

    Transaction.getAll({ fechaInicio, fechaFin, RFC, folio, status }, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

const createTransaction = (req, res) => {
    const { RFC, fechaRetiro, monto, comision } = req.body;

    if (!RFC || !fechaRetiro || !monto || !comision) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    Transaction.create({ RFC, fechaRetiro, monto, comision }, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.notFound) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (result.blocked) {
            return res.status(403).json({ message: 'Usuario bloqueado, no puede realizar transacciones' });
        }

        res.status(201).json({
            message: 'Transacción creada con éxito',
            transactionId: result.insertId
        });
    });
};

const updateTransactionStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['FAILED', 'COMPLETED'].includes(status)) {
        return res.status(400).json({ message: 'Estado inválido' });
    }

    Transaction.updateStatus(id, status, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.notUpdatable) {
            return res.status(400).json({ message: 'Solo se pueden actualizar transacciones en estado PENDING' });
        }

        res.json({ message: 'Estado actualizado correctamente' });
    });
};

const deleteTransaction = (req, res) => {
    const { id } = req.params;
    Transaction.getById(id, (err, transaction) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!transaction) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }
        if (transaction.deleted_at) {
            return res.status(400).json({ message: 'Esta transacción ya ha sido eliminada anteriormente' });
        }
        Transaction.softDelete(id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ message: 'Transacción eliminada correctamente' });
        });
    });
};


const getTransactionSummary = (req, res) => {
    const { RFC } = req.params;

    Transaction.getSummaryByRFC(RFC, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (!results || results.total_retiros === 0) {
            return res.status(404).json({ message: 'No hay transacciones para este usuario' });
        }

        res.json({
            RFC: RFC,
            total_retiros: results.total_retiros,
            monto_total: results.monto_total || 0,
            comision_total: results.comision_total || 0,
            monto_con_comision: results.monto_con_comision || 0
        });
    });
};

module.exports = {
    getAllTransactions,
    createTransaction,
    updateTransactionStatus,
    deleteTransaction,
    getTransactionSummary
};
