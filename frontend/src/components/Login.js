import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react";
import photo from "../assets/photo.jpeg";
import {
  checkPasswordStrength,
  getPasswordStrengthText,
} from "./PasswordStrength";
import Captcha from "./Captcha";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const navigate = useNavigate();
  const captchaRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "password") {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!isCaptchaVerified) {
      setErrorMessage("Please verify the captcha before logging in.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/login",
        formData
      );
      setSuccessMessage(response.data.message);
      setShowOtpPopup(true);
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          error.response.data.message || "Invalid email or password"
        );
      } else if (error.request) {
        setErrorMessage("No response from server. Please try again.");
      } else {
        setErrorMessage("Error: " + error.message);
      }
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input
    if (value !== "" && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const otpValue = otp.join("");

    try {
      const response = await axios.post("http://localhost:3001/verify-otp", {
        email: formData.email,
        otp: parseInt(otpValue),
      });

      setSuccessMessage("OTP verified successfully");
      setIsOtpVerified(true);
      localStorage.setItem("token", response.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || "Invalid OTP");
      } else if (error.request) {
        setErrorMessage("No response from server. Please try again.");
      } else {
        setErrorMessage("Error: " + error.message);
      }
    }
  };

  const handleLogin = () => {
    setSuccessMessage("Login successful");
    setTimeout(() => navigate("/home"), 1000);
  };

  const handleCaptchaVerification = (isVerified) => {
    setIsCaptchaVerified(isVerified);
  };

  useEffect(() => {
    if (showOtpPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showOtpPopup]);

  return (
    <div className="login-container">
      <div className="image-container">
        <img src={photo} alt="Security Illustration" />
      </div>
      <form onSubmit={handleSubmit}>
        <h2 className="welcome">Welcome back!!</h2>
        <h3>Log in to continue your journey.</h3>
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
              onClick={togglePasswordVisibility}
            />
          </div>
          {formData.password && (
            <div
              className={`password-strength-meter strength-${passwordStrength}`}
            >
              <div
                className="strength-bar"
                style={{ width: `${(passwordStrength / 4) * 100}%` }}
                data-percentage={`${Math.round((passwordStrength / 4) * 100)}%`}
              ></div>
              <span className="strength-text">
                {getPasswordStrengthText(passwordStrength)}
              </span>
            </div>
          )}
        </div>
        <Captcha ref={captchaRef} onVerify={handleCaptchaVerification} />
        <button type="submit">Login</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <Link to="/Forgetpassword" className="forget-password">
          Forget password?
        </Link>
        <div className="toggle-link">
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </form>

      {showOtpPopup && (
        <div className="otp-popup-overlay">
          <div className="otp-popup">
            <h2>Enter OTP</h2>
            <div onSubmit={handleOtpSubmit}>
              <div className="verification-code-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    required
                  />
                ))}
              </div>
             <Link to="/home"><button type="submit">Verify OTP</button></Link>
              
            </div>
            {isOtpVerified && (
              <button onClick={handleLogin} className="login-button">
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
