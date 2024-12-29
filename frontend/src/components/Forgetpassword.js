import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Forgetpassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await axios.post('http://localhost:3001/forgetpassword', { email });
      console.log('Server response:', response.data);
      setMessage(response.data.message);
      navigate(`/emailverification?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error('Forget password error:', error);
      if (error.response) {
        setMessage(error.response.data.message || 'An error occurred. Please try again.');
      } else if (error.request) {
        setMessage('No response from server. Please try again later.');
      } else {
        setMessage('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forget-password-container">
      <form className='form2' onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <p>Enter your email address to reset your password.</p>
       
        <div className="input-container">
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Code"}
        </button>

        {message && <p className="message">{message}</p>}

        <div className="toggle-link">
          <p>Remember your password?</p>
          <Link to="/login">Back to Login</Link>
        </div>
      </form>
    </div>
  );
}

export default Forgetpassword;
