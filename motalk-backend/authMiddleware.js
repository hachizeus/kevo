const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    // Skip token verification for the reset password route
    if (req.path === '/reset-password') {
        return next();
    }

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1]; // Get the token from the header

        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, authData) => {
            if (err) {
                return res.status(403).json({ message: 'Token is not valid' });
            } else {
                req.authData = authData; // Attach auth data (e.g., userId) to the request
                req.userId = authData.userId; // Set userId for the current request
                next(); // Proceed to the next middleware/route handler
            }
        });
    } else {
        return res.status(403).json({ message: 'Token is required' });
    }
}

// Middleware to check if user is admin
function isAdmin(req, res, next) {
    const userId = req.userId; // Get userId from the verified token

    db.query('SELECT role FROM users WHERE id = ?', [userId], (error, results) => {
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        if (results.length === 0 || results[0].role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        next(); // Proceed to the next middleware/route handler
    });
}

module.exports = { verifyToken, isAdmin };
