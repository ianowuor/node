const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const user = require('./models/user');

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

module.exports = { router };
