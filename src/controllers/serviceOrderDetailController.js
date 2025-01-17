const db = require('../config/db');

const serviceOrderDetailController = {
    // Agregar servicio a una orden
    addService: async (req, res) => {
        try {
            const { service_order_id } = req.params;
            const { service_id, price, notes } = req.body;

            const result = await db.query(
                `INSERT INTO service_order_details 
                 (service_order_id, service_id, price, notes)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [service_order_id, service_id, price, notes]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Actualizar estado de un servicio en la orden
    updateServiceStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, notes } = req.body;

            const result = await db.query(
                `UPDATE service_order_details 
                 SET status = $1, 
                     notes = $2,
                     completed_at = $3,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = $4
                 RETURNING *`,
                [status, notes, status === 'completed' ? new Date() : null, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Detalle de servicio no encontrado" });
            }

            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Obtener servicios de una orden
    getByOrderId: async (req, res) => {
        try {
            const { service_order_id } = req.params;

            const result = await db.query(
                `SELECT sod.*, s.name as service_name, s.description
                 FROM service_order_details sod
                 JOIN services s ON sod.service_id = s.id
                 WHERE sod.service_order_id = $1
                 ORDER BY sod.created_at`,
                [service_order_id]
            );

            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = serviceOrderDetailController;