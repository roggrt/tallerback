const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const register = async (req, res) => {
    try {
        const { username, password, full_name, email, role } = req.body;

        // Verificar si el usuario ya existe
        const userExists = await db.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "Usuario ya existe" });
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar nuevo usuario
        const result = await db.query(
            `INSERT INTO users (username, password_hash, full_name, email, role)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, username, full_name, email, role`,
            [username, hashedPassword, full_name, email, role]
        );

        const token = jwt.sign(
            { id: result.rows[0].id, username, role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: "Usuario creado exitosamente",
            user: result.rows[0],
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear usuario" });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await db.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: "Login exitoso",
            user: {
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

module.exports = {
    register,
    login
};