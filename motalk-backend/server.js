const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { verifyToken } = require('./authMiddleware');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'MotalkNews'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});
// Create a transporter using your Gmail account
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD, // Your email password or app password
    },
});

// Middleware to verify JWT or Google token
async function verifyAuthToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    const googleToken = req.body.token;

    // Check for Google token in the request body
    if (googleToken) {
        try {
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            req.googleUser = payload; // Save Google user information
            req.userId = payload.sub; // Google 'sub' is the user ID
            return next(); // Proceed to the next middleware
        } catch (error) {
            return res.status(403).json({ message: 'Invalid Google token' });
        }
    }

    // Check for JWT in the Authorization header
    // Check for JWT in the Authorization header
    if (bearerHeader) {
        const bearerToken = bearerHeader.split(' ')[1];
        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, authData) => {
            if (err) {
                return res.status(403).json({ message: 'Token is not valid' });
            } else {
                req.authData = authData; // Attach the decoded JWT data
                req.userId = authData.userId; // Attach userId from JWT
                return next(); // Proceed to the next middleware
            }
        });
    } else {
        return res.status(403).json({ message: 'Token is required' });
    }
}

const { body, validationResult } = require('express-validator');

// Signup route with validation
app.post('/signup', 
    body('full_name').isLength({ min: 1 }).withMessage('Full name is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { full_name, email, password, role = 'user' } = req.body; 

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query('INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)', 
            [full_name, email, hashedPassword, role], 
            (error, results) => {
                if (error) {
                    return res.status(400).json({ error: error.message });
                }
                res.status(201).json({ message: 'User created successfully', userId: results.insertId });
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
);


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [results] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

        if (results.length > 0) {
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (isMatch) {
                const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
                    expiresIn: '1h',
                });
                res.json({ message: 'Login successful', user, token });
            } else {
                res.status(400).json({ message: 'Invalid password' });
            }
        } else {
            res.status(400).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Google Login route
// Google Login route
app.post('/google-login', verifyAuthToken, async (req, res) => {
    const { email, sub, name } = req.googleUser; // Extract user info from token

    try {
        const [results] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (results.length === 0) {
            // User doesn't exist, create a new one
            const newUser = { full_name: name, email, role: 'user' };
            const [insertResult] = await db.promise().query('INSERT INTO users SET ?', newUser);
            const token = jwt.sign({ userId: insertResult.insertId, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(201).json({ message: 'User created successfully', token });
        }

        const user = results[0];
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


const sendEmail = async (to, newPassword) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject: 'Your Password Has Been Reset',
        text: `Your new password is: ${newPassword}. Please change it after logging in.`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

function generateRandomPassword(length = 10) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}
const rateLimit = require('express-rate-limit');

const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Password reset route
app.post('/reset-password', resetPasswordLimiter, async (req, res) => {
    const { email } = req.body; // Get email from request body

    try {
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find user by email
        const [userResults] = await db.promise().query('SELECT id FROM users WHERE email = ?', [email]);
        if (userResults.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userId = userResults[0].id;
        const newPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash new password

        // Update user password in the database
        await db.promise().query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

        // Send email with new password
        await sendEmail(email, newPassword);

        res.json({ message: 'Reset password link has been sent to your email.' });
    } catch (error) {
        console.error('Error in reset-password route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://192.168.1.13:${PORT}`);
});
