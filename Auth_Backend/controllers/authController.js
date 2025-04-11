const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const { username, fullName, email, password } = req.body;

        // Validate input
        if (!username || !fullName || !email || !password) {
            return res.status(400).json({ 
                message: 'Please fill all required fields' 
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if (userExists) {
            return res.status(400).json({ 
                message: 'User already exists with this email or username' 
            });
        }

        // Create user
        const user = await User.create({
            username,
            fullName,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    username: user.username,
                    fullName: user.fullName,
                    email: user.email,
                    token: generateToken(user._id),
                }
            });
        }
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide email and password' 
            });
        }

        // Check for user email
        const user = await User.findOne({ email });
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isMatch = await user.matchPassword(password);
        console.log('Password match:', isMatch);

        if (isMatch) {
            const token = generateToken(user._id);
            console.log('Token generated successfully');
            
            const response = {
                success: true,
                data: {
                    _id: user._id,
                    username: user.username,
                    fullName: user.fullName,
                    email: user.email,
                    token: token,
                }
            };

            // Set token in response header
            res.setHeader('Authorization', `Bearer ${token}`);
            
            console.log('Sending response:', response);
            return res.status(200).json(response);
        } else {
            console.log('Invalid credentials');
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
}; 