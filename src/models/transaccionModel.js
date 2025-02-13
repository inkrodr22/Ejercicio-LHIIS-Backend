const db = require('../config/db');
const User = require('./usuarioModel');

const Transaction = {
    getAll: (filters, callback) => {
        let query = 'SELECT * FROM transacciones WHERE deleted_at IS NULL';
        const params = [];

        if ((filters.fechaInicio && !filters.fechaFin) || (!filters.fechaInicio && filters.fechaFin)) {
            return callback(new Error("Debe proporcionar tanto 'fechaInicio' como 'fechaFin' para filtrar por fecha."), null);
        }

        if (filters.fechaInicio && filters.fechaFin) {
            query += ' AND fechaRetiro BETWEEN ? AND ?';
            params.push(filters.fechaInicio, filters.fechaFin);
        }
        if (filters.RFC) {
            query += ' AND RFC = ?';
            params.push(filters.RFC);
        }
        if (filters.folio) {
            query += ' AND folio = ?';
            params.push(filters.folio);
        }
        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        db.query(query, params, (err, results) => {
            if (err) {
                console.error("Error obteniendo transacciones:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    },

    create: (data, callback) => {
        if (!data.RFC || !data.fechaRetiro || isNaN(data.monto) || isNaN(data.comision)) {
            return callback(new Error("Datos inválidos"), null);
        }

        User.getUserByRFC(data.RFC, (err, results) => {
            if (err) {
                console.error("Error verificando usuario:", err);
                return callback(err, null);
            }
            if (results.length === 0) return callback(null, { notFound: true });
            if (results[0].status !== 'ACTIVE') return callback(null, { blocked: true });

            const getLastFolioQuery = 'SELECT folio FROM transacciones ORDER BY id DESC LIMIT 1';
            db.query(getLastFolioQuery, (err, folioResults) => {
                if (err) {
                    console.error("Error obteniendo último folio:", err);
                    return callback(err, null);
                }

                let lastNumber = 0;
                if (folioResults.length > 0) {
                    lastNumber = parseInt(folioResults[0].folio.replace('AAF', ''), 10);
                }

                const newFolio = `AAF${(lastNumber + 1).toString().padStart(5, '0')}`;

                const insertQuery = `
                    INSERT INTO transacciones (RFC, fechaRetiro, monto, comision, status, folio)
                    VALUES (?, ?, ?, ?, "PENDING", ?)
                `;
                const params = [data.RFC, data.fechaRetiro, data.monto, data.comision, newFolio];

                db.query(insertQuery, params, (err, result) => {
                    if (err) {
                        console.error("Error insertando transacción:", err);
                        return callback(err, null);
                    }
                    callback(null, result);
                });
            });
        });
    },

    updateStatus: (id, status, callback) => {
        if (!['FAILED', 'COMPLETED'].includes(status)) {
            return callback(new Error("Estado inválido"), null);
        }
        const query = `
        UPDATE transacciones 
        SET status = ? 
        WHERE id = ? AND status = "PENDING"
    `;

        db.query(query, [status, id], (err, result) => {
            if (err) {
                console.error("Error actualizando transacción:", err);
                return callback(err, null);
            }

            if (result.affectedRows === 0) {
                return callback(null, { notUpdatable: true });
            }

            callback(null, result);
        });
    },

    getById : (id, callback) => {
        const query = 'SELECT * FROM transacciones WHERE id = ?';
        db.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results.length > 0 ? results[0] : null);
        });
    },

    softDelete: (id, callback) => {
        db.query('SELECT id FROM transacciones WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error("Error buscando transacción para eliminar:", err);
                return callback(err, null);
            }

            if (results.length === 0) {
                return callback(null, { notFound: true });
            }

            const query = 'UPDATE transacciones SET deleted_at = NOW() WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) {
                    console.error("Error eliminando transacción:", err);
                    return callback(err, null);
                }
                callback(null, result);
            });
        });
    },

    getSummaryByRFC: (RFC, callback) => {
        const query = `
        SELECT 
            COUNT(id) AS total_retiros,
            COALESCE(SUM(monto), 0) AS monto_total,
            COALESCE(SUM(comision), 0) AS comision_total,
            COALESCE(SUM(monto + comision), 0) AS monto_con_comision
        FROM transacciones
        WHERE RFC = ? AND (deleted_at IS NULL OR deleted_at IS NULL)
    `;

        db.query(query, [RFC], (err, results) => {
            if (err) {
                console.error("Error obteniendo resumen:", err);
                return callback(err, null);
            }

            if (!results || results.length === 0 || !results[0].total_retiros) {
                return callback(null, { total_retiros: 0, monto_total: 0, comision_total: 0, monto_con_comision: 0 });
            }

            callback(null, results[0]);
        });
    }

};

module.exports = Transaction;
