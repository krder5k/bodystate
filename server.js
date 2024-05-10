const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// MongoDB Connection using Environment Variable
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a Mongoose schema and model for Users
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    stepsUrl: String,
    sleepUrl: String,
    fiwareService: String,
    fiwareServicePath: String,
});
const User = mongoose.model('User', userSchema);

// Serve static files
app.use(express.static(path.join(__dirname)));

// Redirect root to login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Pre-flight request handler for login
app.options('/login', (req, res) => {
    res.status(200).end();
});

// Login route handler
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && bcrypt.compareSync(password, user.password)) {
            // Authentication successful
            res.json({
                success: true,
                message: "Login successful",
                stepsUrl: user.stepsUrl,
                sleepUrl: user.sleepUrl,
                fiwareService: user.fiwareService,
                fiwareServicePath: user.fiwareServicePath
            });
        } else {
            // Authentication failed
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
