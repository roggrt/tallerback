const db = require('../config/db');

const searchController = {
    // Búsqueda avanzada de clientes
    searchClients: async (req, res) => {
        try {
            const { term } = req.query;
            const searchTerm = `%${term}%`;

            const result = await db.query(
                `SELECT * FROM clients 
                 WHERE name ILIKE $1 
                 OR identification_number ILIKE $1 
                 OR phone ILIKE $1 
                 OR email ILIKE $1
                 ORDER BY name`,
                [searchTerm]
            );

            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Búsqueda de vehículos por placa
    searchVehicles: async (req, res) => {
        try {
            const { plate } = req.query;
            const result = await db.query(
                `SELECT v.*, c.name as client_name 
                 FROM vehicles v
                 JOIN clients c ON v.client_id = c.id
                 WHERE v.plate_number ILIKE $1`,
                [`%${plate}%`]
            );

            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Búsqueda de órdenes por varios criterios
    searchOrders: async (req, res) => {
        try {
            const {
                order_number,
                client_name,
                plate_number,
                status,
                date_from,
                date_to
            } = req.query;

            let query = `
                SELECT so.*, 
                       c.name as client_name,
                       v.plate_number,
                       v.brand,
                       v.model
                FROM service_orders so
                JOIN clients c ON so.client_id = c.id
                JOIN vehicles v ON so.vehicle_id = v.id
                WHERE 1=1
            `;

            const params = [];
            let paramCounter = 1;

            if (order_number) {
                query += ` AND so.order_number ILIKE $${paramCounter}`;
                params.push(`%${order_number}%`);
                paramCounter++;
            }

            if (client_name) {
                query += ` AND c.name ILIKE $${paramCounter}`;
                params.push(`%${client_name}%`);
                paramCounter++;
            }

            if (plate_number) {
                query += ` AND v.plate_number ILIKE $${paramCounter}`;
                params.push(`%${plate_number}%`);
                paramCounter++;
            }

            if (status) {
                query += ` AND so.status = $${paramCounter}`;
                params.push(status);
                paramCounter++;
            }

            if (date_from) {
                query += ` AND so.entry_date >= $${paramCounter}`;
                params.push(date_from);
                paramCounter++;
            }

            if (date_to) {
                query += ` AND so.entry_date <= $${paramCounter}`;
                params.push(date_to);
                paramCounter++;
            }

            query += ` ORDER BY so.created_at DESC`;

            const result = await db.query(query, params);
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = searchController;