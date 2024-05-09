const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path'); // Add this line to include the 'path' module
const app = express();
const port = 8080;

// Middleware to parse JSON bodies
app.use(express.json());


// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});



// MongoDB Connection
mongoose.connect('mongodb+srv://kristinaderyagina:testuser1@cluster0.etwheso.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a Mongoose schema and model for Users
const userSchema = new mongoose.Schema({
    username:  { type: String, required: true },
    password: { type: String, required: true },
    stepsUrl: String,
    sleepUrl: String,
    fiwareService: String,
    fiwareServicePath: String,
});

const User = mongoose.model('User', userSchema);

// Serve your local website using Express static middleware
const localWebsitePath = path.join(__dirname, 'public'); // Change this line
app.use(express.static(localWebsitePath));


// Create a route to handle requests to your main page (now serving login.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(localWebsitePath, 'login.html')); // Update this line to point to login.html
});

// Route for handling login with explicit CORS headers
app.options('/login', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.status(200).send();
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username });
        console.log(user); // Добавлено для отладки
        if (user && bcrypt.compareSync(password, user.password)) {
            // Пароли совпадают
            res.json({ success: true, message: "Login successful",  stepsUrl: user.stepsUrl, sleepUrl: user.sleepUrl, fiwareService: user.fiwareService, fiwareServicePath: user.fiwareServicePath });
        } else {
            // Пароли не совпадают
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "An error occurred" });
        console.error(error); // Добавлено для отладки
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
