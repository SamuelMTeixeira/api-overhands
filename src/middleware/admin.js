const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth')
const User = require('../models/User')

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Token is missing' });
        }

        const parts = authHeader.split(' ');

        if (parts.length !== 2) {
            return res.status(401).json({ error: 'Token error' });
        }

        const [scheme, token] = parts;

        const decoded = jwt.verify(token, authConfig.secret);

        const userId = decoded.id;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ error: 'Access denied' });
        }

        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }

}