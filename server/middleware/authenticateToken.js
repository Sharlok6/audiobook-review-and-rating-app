const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access token not found' });
    }

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(403).json({ message: 'Token verification failed' });
        }
        req.user = user;
        next(); // Pass the control to the next middleware or route handler
    });
};

module.exports = authenticateToken;
