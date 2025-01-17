const db = require('../config/db');

const serviceOrderController = {
    // Crear nueva orden
    create: async (req, res) => {
        try {
            const {
                vehicle_id,
                client_id,
                entry_date,
                estimated_exit_date,
                observations,
                initial_diagnosis,
                fuel_level
            } = req.body;

            // Generar número de orden único (ejemplo: ORD-2024-0001)
            const year = new Date().getFullYear();
            const lastOrderResult = await db.query(
                "SELECT order_number FROM service_orders WHERE order_number LIKE $1 ORDER BY order_number DESC LIMIT 1",
                [`ORD-${year}-%`]
            );

            let orderNumber;
            if (lastOrderResult.rows.length === 0) {
                orderNumber = `ORD-${year}-0001`;
            } else {
                const lastNumber = parseInt(lastOrderResult.rows[0].order_number.split('-')[2]);
                orderNumber = `ORD-${year}-${String(lastNumber + 1).padStart(4, '0')}`;
            }

            const result = await db.query(
                `INSERT INTO service_orders (
                    order_number, vehicle_id, client_id, entry_date,
                    estimated_exit_date, observations, initial_diagnosis,
                    fuel_level, status, created_by
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *`,
                [orderNumber, vehicle_id, client_id, entry_date,
                    estimated_exit_date, observations, initial_diagnosis,
                    fuel_level, 'pending', req.user.id]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    },

    // Obtener todas las órdenes
    getAll: async (req, res) => {
        try {
            const result = await db.query(
                `SELECT so.*, 
                        c.name as client_name,
                        v.brand, v.model, v.plate_number,
                        u.username as created_by_user
                 FROM service_orders so
                 JOIN clients c ON so.client_id = c.id
                 JOIN vehicles v ON so.vehicle_id = v.id
                 JOIN users u ON so.created_by = u.id
                 ORDER BY so.created_at DESC`
            );
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Obtener órdenes por cliente
    getByClient: async (req, res) => {
        try {
            const { clientId } = req.params;
            const result = await db.query(
                `SELECT so.*, 
                        v.brand, v.model, v.plate_number
                 FROM service_orders so
                 JOIN vehicles v ON so.vehicle_id = v.id
                 WHERE so.client_id = $1
                 ORDER BY so.created_at DESC`,
                [clientId]
            );
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Actualizar estado de orden
    // updateStatus: async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         const { status, actual_exit_date, notes } = req.body;
    //
    //         const result = await db.query(
    //             `UPDATE service_orders
    //              SET status = $1,
    //                  actual_exit_date = $2,
    //                  notes = $3,
    //                  updated_at = CURRENT_TIMESTAMP,
    //                  updated_by = $4
    //              WHERE id = $5
    //              RETURNING *`,
    //             [status, actual_exit_date, notes, req.user.id, id]
    //         );
    //
    //         if (result.rows.length === 0) {
    //             return res.status(404).json({ message: "Orden no encontrada" });
    //         }
    //
    //         res.json(result.rows[0]);
    //     } catch (error) {
    //         res.status(500).json({ message: error.message });
    //     }
    // },


    // En serviceOrderController.js, modificamos el método updateStatus:

    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, actual_exit_date, observations } = req.body; // Cambiamos notes por observations

            const result = await db.query(
                `UPDATE service_orders 
             SET status = $1, 
                 actual_exit_date = $2,
                 observations = $3,
                 updated_at = CURRENT_TIMESTAMP,
                 updated_by = $4
             WHERE id = $5
             RETURNING *`,
                [status, actual_exit_date, observations, req.user.id, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Orden no encontrada" });
            }

            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Obtener detalles de una orden específica
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await db.query(
                `SELECT so.*, 
                        c.name as client_name, c.phone as client_phone,
                        v.brand, v.model, v.plate_number,
                        u.username as created_by_user,
                        u2.username as updated_by_user
                 FROM service_orders so
                 JOIN clients c ON so.client_id = c.id
                 JOIN vehicles v ON so.vehicle_id = v.id
                 JOIN users u ON so.created_by = u.id
                 LEFT JOIN users u2 ON so.updated_by = u2.id
                 WHERE so.id = $1`,
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Orden no encontrada" });
            }

            // Obtener los servicios asociados a la orden
            const services = await db.query(
                `SELECT sod.*, s.name as service_name, s.description
                 FROM service_order_details sod
                 JOIN services s ON sod.service_id = s.id
                 WHERE sod.service_order_id = $1`,
                [id]
            );

            const orderData = result.rows[0];
            orderData.services = services.rows;

            res.json(orderData);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = serviceOrderController;