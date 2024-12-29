import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Icon } from "@iconify/react";
import photo from '../assets/photo.jpeg';
import {
  checkPasswordStrength,
  getPasswordStrengthText,
  getPasswordFeedback,
} from "./PasswordStrength.js";

const Signup = () => {    
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Input change detected:", name, value);  // Log input changes
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
      setPasswordFeedback(getPasswordFeedback(value));
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate password strength
  const validatePassword = (password) => {
    return password.length >= 12;
  };

  // Validate username length
  const validateUsername = (username) => {
    return username.length >= 5;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);  // Log form submission

    setErrorMessage('');
    setSuccessMessage('');

    // Validate email
    if (!validateEmail(formData.email)) {
      setErrorMessage("Invalid email format");
      return;
    }

    // Validate password
    if (!validatePassword(formData.password)) {
      setErrorMessage("Password must be at least 12 characters long");
      return;
    }

    // Validate username
    if (!validateUsername(formData.username)) {
      setErrorMessage("Username must be at least 5 characters long");
      return;
    }

    // Validate matching passwords
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      console.log("Sending request to signup endpoint");  // Log request attempt
      const response = await axios.post('http://localhost:3001/signup', formData);

      console.log("Signup successful:", response.data);  // Log successful response
      setSuccessMessage('Signup successful');
      setTimeout(() => navigate('/login'), 2000);  // Redirect after signup
    } catch (error) {
      console.log("Error during signup:", error);  // Log errors

      if (error.response) {
        setErrorMessage(error.response.data.message || 'Error during signup');
      } else if (error.request) {
        setErrorMessage('No response from server. Please try again.');
      } else {
        setErrorMessage('Error: ' + error.message);
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="image-container">
        <img src={photo} alt="Security Illustration" />
      </div>
      <form onSubmit={handleSubmit}>
        <h2 className='welcome'>Welcome!</h2>
        <h3>Sign up to start your journey.</h3>

        {/* Username Input */}
        <div className="input-container">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email Input */}
        <div className="input-container">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Input */}
        <div className="input-container">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Icon
              icon={showPassword ? "la:eye" : "la:eye-slash"}
              className="password-toggle-icon"
              onClick={() => togglePasswordVisibility('password')}
            />
          </div>
          {/* Password Strength Meter */}
          {formData.password && (
            <div className={`password-strength-meter strength-${passwordStrength}`}>
              <div
                className="strength-bar"
                style={{ width: `${(passwordStrength / 4) * 100}%` }}
                data-percentage={`${Math.round((passwordStrength / 4) * 100)}%`}
              ></div>
              <span className="strength-text">{getPasswordStrengthText(passwordStrength)}</span>
            </div>
          )}
          {passwordFeedback && <p className="password-feedback">{passwordFeedback}</p>}
        </div>

        {/* Confirm Password Input */}
        <div className="input-container">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <Icon
              icon={showConfirmPassword ? "la:eye" : "la:eye-slash"}
              className="password-toggle-icon"
              onClick={() => togglePasswordVisibility('confirmPassword')}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit">Sign Up</button>

        {/* Error and Success Messages */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        {/* Toggle link to login page */}
        <div className="toggle-link">
          <p>Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
