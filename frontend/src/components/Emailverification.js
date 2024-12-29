import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Emailverification = () => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email');

  const handleVerificationCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
   
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await axios.post('http://localhost:3001/forgetpassword', { email });
      setMessage('Verification code resent. Please check your email.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error resending verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const verificationCodeNumber = parseInt(verificationCode.join(''), 10);

    try {
      const response = await axios.post('http://localhost:3001/emailverification', { 
        email, 
        verificationCode: verificationCodeNumber
      });
      setMessage(response.data.message);
      // Navigate to ResetPassword page with email only
      navigate('/resetpassword', { state: { email } });
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="email-verification-container">
      <form className='form2' onSubmit={handleSubmit}>
        <h2>Email Verification</h2>
        <p>Enter the verification code sent to {email && email.replace(/(.{2})(.*)(?=@)/, (_, a, b) => a + b.replace(/./g, '*'))}.</p>
       
        <div className="verification-code-inputs">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength="1"
              value={verificationCode[index]}
              onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
              required
            />
          ))}
        </div>

        <div className="button-container">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
          <button type="button" onClick={handleResendCode} disabled={isLoading}>
            Resend Code
          </button>
        </div>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default Emailverification;
