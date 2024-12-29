import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Icon } from "@iconify/react";
import { checkPasswordStrength, getPasswordStrengthText } from './PasswordStrength';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setEmail(location.state.email || '');
      setVerificationCode(location.state.verificationCode || '');
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:3001/resetpassword', {
        email,
        password,
        verificationCode
      });
      setMessage(response.data.message);
      setIsResetSuccessful(true);
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password reset successful. Please log in with your new password.' } });
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(checkPasswordStrength(value));
  };

  return (
    <div className="reset-password-container">
      <form className='form2' onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <p>Enter your new password.</p>
       
        <div className="input-container">
          <label htmlFor="password">New Password</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
              placeholder="Enter new password"
            />
            <Icon
              icon={showPassword ? "la:eye" : "la:eye-slash"}
              className="password-toggle-icon"
              onClick={() => togglePasswordVisibility('password')}
            />
          </div>
          {password && (
            <div className={`password-strength-meter strength-${passwordStrength}`}>
              <div
                className="strength-bar"
                style={{ width: `${(passwordStrength / 4) * 100}%` }}
                data-percentage={`${Math.round((passwordStrength / 4) * 100)}%`}
              ></div>
              <span className="strength-text">{getPasswordStrengthText(passwordStrength)}</span>
            </div>
          )}
        </div>

        <div className="input-container">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <div className="password-input">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
            />
            <Icon
              icon={showConfirmPassword ? "la:eye" : "la:eye-slash"}
              className="password-toggle-icon"
              onClick={() => togglePasswordVisibility('confirmPassword')}
            />
          </div>
        </div>

      <Link to="/login" ><button type="submit" disabled={isLoading || isResetSuccessful}>
          {isLoading ? 'save password  ' : 'Reset'}
        </button>
        </Link>
       

        {message && <p className={`message ${isResetSuccessful ? 'success' : ''}`}>{message}</p>}
      </form>
    </div>
  );
}

export default ResetPassword;
