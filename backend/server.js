const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { checkPasswordStrength, getPasswordFeedback, getPasswordStrengthText } = require('./passwordStrength');
const otpGenerator = require('otp-generator');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));

// Middleware for parsing JSON
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/cybersecurity", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB', err.message));

// Placeholder route
app.get('/', (req, res) => {
  res.send('MongoDB connection established!');
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Middleware to check password strength
const checkPasswordStrengthMiddleware = (req, res, next) => {
  const { password } = req.body;
  const strengthScore = checkPasswordStrength(password);
  const feedback = getPasswordFeedback(password);

  if (strengthScore < 3) {
    return res.status(400).json({
      message: "Password is not strong enough",
      strength: getPasswordStrengthText(strengthScore),
      feedback: feedback
    });
  }
  next();
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};



// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login attempt with email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user);

    const isPasswordValid = await user.comparePassword(password);
    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate OTP
    const otp = user.setOTP();
    await user.save();

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Login OTP',
      text: `Your OTP for login is: ${otp}`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify OTP route
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.verifyOTP(otp)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP fields
    user.clearOTP();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: "Server error" });
  }
});



// Signup route
app.post('/signup', checkPasswordStrengthMiddleware, async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  console.log("Signup request received with data:", { username, email });

  if (password !== confirmPassword) {
    console.log("Passwords do not match");
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    console.log("Checking if user already exists with email:", email);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({
      username,
      email,
      password
    });

    console.log("Saving new user to the database...");
    const result = await newUser.save();
    console.log("User registered successfully:", result);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: result._id,
        username: result.username,
        email: result.email,
      },
      redirect: '/login',
    });
  } catch (err) {
    console.error("Error during signup:", err.message);
    console.error("Error details:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Forget Password route
app.post('/forgetpassword', async (req, res) => {
  const { email } = req.body;
  console.log('Received forget password request for email:', email);

  try {
    if (!email) {
      console.log('Email not provided in request');
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ message: "User not found" });
    }

    console.log('User found:', user);

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    user.resetPasswordCode = verificationCode;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Verification Code',
      text: `Your verification code is: ${verificationCode}`
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');

    res.json({ message: `Verification code sent to ${email.replace(/(.{2})(.*)(?=@)/, (_, a, b) => a + b.replace(/./g, '*'))}` });
  } catch (error) {
    console.error('Forget password error:', error);
    res.status(500).json({ message: "An unexpected error occurred. Please try again." });
  }
});

// Reset Password route
app.post('/resetpassword', checkPasswordStrengthMiddleware, async (req, res) => {
  const { email, password, verificationCode } = req.body;
 
  try {
    console.log('Received reset password request:', { email, verificationCode });

    const user = await User.findOne({
      email,
      resetPasswordCode: verificationCode,
      resetPasswordExpires: { $gt: Date.now() }
    });

    // if (!user) {
    //   console.log('User not found or invalid code for:', email);
    //   return res.status(404).json({ message: "User not found or invalid verification code" });
    //}

    console.log('User found:', user);

    // Compare the new password with the current hashed password
    const isSameAsOld = await bcrypt.compare(password, user.password);
    if (isSameAsOld) {
      return res.status(400).json({ message: 'New password must be different from the old password' });
    }

    // Hash the new password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password and clear reset-related fields
    user.password = hashedPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('Password reset successfully for:', email);
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    // console.error('Reset password error:', error);
    // res.status(500).json({ message: "Error resetting password. Please try again." });
  }
});

// Verify Email route
app.post('/emailverification', async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetPasswordCode: verificationCode,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ message: "Error verifying email. Please try again." });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
