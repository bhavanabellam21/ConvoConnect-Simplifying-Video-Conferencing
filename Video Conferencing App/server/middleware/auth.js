import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
    let token;

    // Check if the token is in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const verified = jwt.verify(token, process.env.JWT_SECRET);

            // Get the user from the token and exclude the password field
            req.user = await User.findById(verified.id).select("-password");

            // Proceed to the next middleware/route handler
            next();
        } catch (err) {
            // Specific error handling for JWT errors
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Invalid Token' });
            }
            // General error handling
            return res.status(500).json({ error: err.message });
        }
    }

    // If there's no token
    if (!token) {
        return res.status(403).json({ error: "Access Denied" });
    }
};