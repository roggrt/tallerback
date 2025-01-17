const db = require('../config/db');

const vehicleController = {
    // Obtener todos los vehículos
    getAll: async (req, res) => {
        try {
            const result = await db.query(
                `SELECT v.*, c.name as client_name 
                 FROM vehicles v 
                 JOIN clients c ON v.client_id = c.id 
                 ORDER BY v.created_at DESC`
            );
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Obtener vehículos por cliente
    getByClient: async (req, res) => {
        try {
            const { clientId } = req.params;
            const result = await db.query(
                'SELECT * FROM vehicles WHERE client_id = $1',
                [clientId]
            );
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Crear nuevo vehículo
    create: async (req, res) => {
        try {
            const {
                client_id, brand, model, year, color,
                plate_number, mileage, vin
            } = req.body;

            const result = await db.query(
                `INSERT INTO vehicles (
                    client_id, brand, model, year, color,
                    plate_number, mileage, vin
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *`,
                [client_id, brand, model, year, color,
                    plate_number, mileage, vin]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Actualizar vehículo
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                brand, model, year, color,
                plate_number, mileage, vin
            } = req.body;

            const result = await db.query(
                `UPDATE vehicles 
                 SET brand = $1, model = $2, year = $3,
                     color = $4, plate_number = $5,
                     mileage = $6, vin = $7,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = $8
                 RETURNING *`,
                [brand, model, year, color,
                    plate_number, mileage, vin, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Vehículo no encontrado" });
            }

            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = vehicleController;