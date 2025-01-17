const db = require('../config/db');

const clientController = {
    // Obtener todos los clientes
    getAll: async (req, res) => {
        try {
            const result = await db.query(
                'SELECT * FROM clients ORDER BY created_at DESC'
            );
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Obtener un cliente por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await db.query(
                'SELECT * FROM clients WHERE id = $1',
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Cliente no encontrado" });
            }

            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Crear nuevo cliente
    create: async (req, res) => {
        try {
            const { name, phone, email, identification_number, address } = req.body;

            const result = await db.query(
                `INSERT INTO clients (name, phone, email, identification_number, address)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [name, phone, email, identification_number, address]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Actualizar cliente
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, phone, email, identification_number, address } = req.body;

            const result = await db.query(
                `UPDATE clients 
                 SET name = $1, phone = $2, email = $3, 
                     identification_number = $4, address = $5,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = $6
                 RETURNING *`,
                [name, phone, email, identification_number, address, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Cliente no encontrado" });
            }

            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = clientController;