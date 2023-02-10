const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Token is missing" });
        }

        const tokenParts = authHeader.split(" ");

        if (tokenParts.length !== 2) {
            return res.status(401).json({ error: "Token error" });
        }

        const [scheme, token] = tokenParts;

        const decoded = jwt.verify(token, authConfig.secret);

        const userId = decoded.id;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        return await next();
    }
    catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};