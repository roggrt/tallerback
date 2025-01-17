const { check, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validaciones para clientes
const clientValidations = [
    check('name').notEmpty().trim().withMessage('El nombre es requerido'),
    check('phone').optional().matches(/^\+?[\d\s-]+$/).withMessage('Teléfono inválido'),
    check('email').optional().isEmail().withMessage('Email inválido'),
    check('identification_number').notEmpty().withMessage('Número de identificación requerido')
];

// Validaciones para vehículos
const vehicleValidations = [
    check('brand').notEmpty().withMessage('La marca es requerida'),
    check('model').notEmpty().withMessage('El modelo es requerido'),
    check('plate_number').notEmpty().matches(/^[A-Z0-9-]+$/).withMessage('Placa inválida'),
    check('client_id').isNumeric().withMessage('ID de cliente inválido')
];

// Validaciones para órdenes de servicio
const serviceOrderValidations = [
    check('vehicle_id').isNumeric().withMessage('ID de vehículo inválido'),
    check('client_id').isNumeric().withMessage('ID de cliente inválido'),
    check('entry_date').isISO8601().withMessage('Fecha de entrada inválida'),
    check('fuel_level').isInt({ min: 0, max: 100 }).withMessage('Nivel de combustible inválido')
];

module.exports = {
    validate,
    clientValidations,
    vehicleValidations,
    serviceOrderValidations
};