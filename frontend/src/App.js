
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login.js';
import Signup from './components/Signup.js';
import EmailVerification from './components/Emailverification.js';
import Home from './components/Home.js';
import Forgetpassword  from './components/Forgetpassword.js';
import Ressetpassword from './components/Resetpassword.js';
import "./App.css";

import Passwordstrength from './components/PasswordStrength.js'
import Captcha from './components/Captcha.js';


const App = () => {
  return (
    <Router>
      <div className="form-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/emailverification" element={< EmailVerification/>} />
          <Route path="/resetpassword" element={< Ressetpassword/>} />
          <Route path="/forgetpassword" element={< Forgetpassword/>} />
          <Route path="/home" element={< Home />} />
          <Route path="/captcha" element={<Captcha />} />
          <Route path="/passwordstrength" element={<Passwordstrength />} />
        </Routes> 
      </div>
    </Router>
  );
};

export default App;
