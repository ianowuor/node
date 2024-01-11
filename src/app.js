const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const router = express.Router();
const bcrypt = require('bcrypt');
const user = require('./models/user');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: 'http:localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
    credentials: true,
  }));

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const PORT = 3000;
const CONNECTION = process.env.CONNECTION;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/signup.html'));
});

router.post ('/signup', async (req, res) => {
    try {
        console.log('Signup route reached');
        // Extract form data
        const { firstName, lastName, email, password } = req.body;

        // Validate data
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        // Check for existing user with the same email
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create a new user object
        const newUser = new user({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        // Save user to database
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error creating user' });
    }
});

app.use('/signup', router);

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://owuorian:We5Dc6anopodPrU3@cluster0.wy5znwg.mongodb.net/?retryWrites=true&w=majority');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });        
    } catch (e) {
        console.log(`Something went wrong: ${e.message}`);
    }
};

start();
