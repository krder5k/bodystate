const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path'); // Add this line to include the 'path' module
const app = express();
const port = 8080;

const secretKey = 'id3773873232895235827cdnsbvjfsjv'; 

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// MongoDB Connection
mongoose.connect('mongodb+srv://kristinaderyagina:testuser1@cluster0.etwheso.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a Mongoose schema and model for Users
const userSchema = new mongoose.Schema({
    username: String,
    password: String, // This will be a hashed password
    role: String, // Add a 'role' field to the schema
    dataUrls: [String], // Add a 'dataUrls' field to the schema
});

const User = mongoose.model('User', userSchema);

// Serve your local website using Express static middleware
const publicFolderPath = path.join(__dirname, '');
app.use(express.static(publicFolderPath));

// Create a route to handle requests to your main page (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(publicFolderPath, 'index.html'));
});

// Route for handling login with explicit CORS headers
app.options('/login', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.status(200).send();
});

// Define the verification middleware
function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Token not provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
        }

        // Token is valid, and you can access user information from 'decoded' if needed
        req.decoded = decoded; // Store the decoded token in the request object

        next(); // Continue with the next middleware or route handler
    });
}

// Protected route example: Apply the 'verifyToken' middleware to routes that require authentication
app.get('/protected-route', verifyToken, (req, res) => {
    // This route is protected and will only be accessible with a valid token
    const userRole = req.decoded.role; // Access user's role from decoded token

    if (userRole === 'admin') {
        // User is authorized to access the admin panel
        res.json({ success: true, message: 'Access granted to protected route' });
    } else {
        // User is not authorized
        res.status(403).json({ success: false, message: 'Access denied: Insufficient permissions' });
    }
});

// Route for handling user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username });
        if (user && bcrypt.compareSync(password, user.password)) {
            // Passwords match

            const payload = {
                username: user.username, // Add any user information you need
                role: user.role, // Include the user's role in the payload
                dataUrls: user.dataUrls, // Include data URLs in the payload
            };

            // Generate a JWT token with the payload and your secret key
            const token = jwt.sign(payload, secretKey);

            // Include the token in the response
            res.json({ success: true, message: "Login successful", token: token });
        } else {
            // Passwords don't match
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "An error occurred" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
