const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path'); // This line is included to handle path operations
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
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define a Mongoose schema and model for Users
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    stepsUrl: String,
    sleepUrl: String,
    fiwareService: String,
    fiwareServicePath: String,
});
const User = mongoose.model('User', userSchema);

// Serve your local website using Express static middleware from the root directory
app.use(express.static(__dirname));

// Create a route to handle requests to the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html')); // Make sure the path is directly pointing to the root directory
});

// Route for handling login with explicit CORS headers
app.options('/login', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.status(200).send();
});

// Route to handle POST requests for login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        console.log(user); // Added for debugging
        if (user && bcrypt.compareSync(password, user.password)) {
            // Passwords match
            res.json({ success: true, message: "Login successful", stepsUrl: user.stepsUrl, sleepUrl: user.sleepUrl, fiwareService: user.fiwareService, fiwareServicePath: user.fiwareServicePath });
        } else {
            // Passwords do not match
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "An error occurred" });
        console.error(error); // Added for debugging
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
