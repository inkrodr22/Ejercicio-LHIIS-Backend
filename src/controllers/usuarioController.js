const User = require('../models/usuarioModel');

const getAllUsers = (req, res) => {
    User.getAllUsers((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

const getUserByRFC = (req, res) => {
    const { RFC } = req.params;

    User.getUserByRFC(RFC, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(results[0]);
    });
};

const createUser = (req, res) => {
    const { RFC, nombre, apellidos, status } = req.body;

    if (!RFC || !nombre || !apellidos || !status) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    User.createUser({ RFC, nombre, apellidos, status }, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Usuario creado con éxito', id: result.insertId });
    });
};

const blockUser = (req, res) => {
    const { RFC } = req.params;

    User.blockUser(RFC, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.notFound) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (result.alreadyLocked) {
            return res.status(400).json({ message: 'El usuario ya está bloqueado' });
        }

        res.json({ message: `Usuario con RFC ${RFC} bloqueado exitosamente` });
    });
};

const deleteUserById = (req, res) => {
    const { id } = req.params;

    User.deleteUserById(id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.error) {
            return res.status(404).json({ message: result.error });
        }

        res.json({ message: 'Usuario eliminado correctamente' });
    });
};

module.exports = {
    getAllUsers,
    getUserByRFC,
    createUser,
    blockUser,
    deleteUserById
};
