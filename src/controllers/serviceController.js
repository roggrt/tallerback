const db = require('../config/db');

const serviceController = {
    // Obtener todos los servicios
    getAll: async (req, res) => {
        try {
            const result = await db.query(
                'SELECT * FROM services ORDER BY name ASC'
            );
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Crear nuevo servicio
    create: async (req, res) => {
        try {
            const { name, description, standard_price, estimated_time } = req.body;

            const result = await db.query(
                `INSERT INTO services (name, description, standard_price, estimated_time)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [name, description, standard_price, estimated_time]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Actualizar servicio
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, standard_price, estimated_time } = req.body;

            const result = await db.query(
                `UPDATE services 
                 SET name = $1, 
                     description = $2, 
                     standard_price = $3, 
                     estimated_time = $4,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = $5
                 RETURNING *`,
                [name, description, standard_price, estimated_time, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Servicio no encontrado" });
            }

            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Obtener servicio por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await db.query(
                'SELECT * FROM services WHERE id = $1',
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Servicio no encontrado" });
            }

            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = serviceController;