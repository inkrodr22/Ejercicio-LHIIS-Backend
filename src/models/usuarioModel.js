const db = require('../config/db');

const User = {
    getAllUsers: (callback) => {
        const query = 'SELECT * FROM usuarios';
        db.query(query, (err, results) => {
            if (err) {
                console.error("Error obteniendo usuarios:", err);
                return callback(err, null);
            }
            callback(null, results);
        });    },

    getUserByRFC: (RFC, callback) => {
        const query = 'SELECT * FROM usuarios WHERE RFC = ?';
        db.query(query, [RFC], (err, results) => {
            if (err) {
                console.error("Error obteniendo usuario por RFC:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    },

    createUser: (data, callback) => {
        if (!data.RFC || !data.nombre || !data.apellidos || !data.status) {
            return callback(new Error("Datos inválidos para crear usuario"), null);
        }

        const query = 'INSERT INTO usuarios (RFC, nombre, apellidos, status) VALUES (?, ?, ?, ?)';
        const params = [data.RFC, data.nombre, data.apellidos, data.status];

        db.query(query, params, (err, result) => {
            if (err) {
                console.error("Error creando usuario:", err);
                return callback(err, null);
            }
            callback(null, result);
        });
    },

    blockUser: (RFC, callback) => {
        const checkQuery = 'SELECT * FROM usuarios WHERE RFC = ?';
        db.query(checkQuery, [RFC], (err, results) => {
            if (err) {
                console.error("Error verificando usuario:", err);
                return callback(err, null);
            }

            if (results.length === 0) {
                return callback(null, { notFound: true });
            }

            if (results[0].status === 'LOCKED') {
                return callback(null, { alreadyLocked: true });
            }

            const updateQuery = 'UPDATE usuarios SET status = "LOCKED" WHERE RFC = ?';
            db.query(updateQuery, [RFC], (err, result) => {
                if (err) {
                    console.error("Error bloqueando usuario:", err);
                    return callback(err, null);
                }

                if (result.affectedRows === 0) {
                    return callback(null, { notUpdated: true });
                }

                callback(null, result);
            });
        });
    },

    deleteUserById: (id, callback) => {
        const checkQuery = 'SELECT * FROM usuarios WHERE id = ?';
        db.query(checkQuery, [id], (err, results) => {
            if (err) return callback(err, null);

            if (results.length === 0) {
                return callback(null, { error: "Usuario no encontrado" });
            }

            const deleteQuery = 'DELETE FROM usuarios WHERE id = ?';
            db.query(deleteQuery, [id], (err, result) => {
                if (err) return callback(err, null);
                callback(null, { message: `Usuario con ID ${id} eliminado correctamente` });
            });
        });
    }


};

module.exports = User;
