
The cybersecurity project is a full-stack application for is a user authentication system using Node.js, Express, and MongoDB, offering secure fS


## Features
1.User Signup: 
New users can register with a username, email, and password. Password strength is validated to ensure security.

2.Login with OTP: 
Users can log in using their email and password. An OTP (One-Time Password) is sent to their email for verification.

3.Password Reset: 
Users can reset their password using a verification code sent to their registered email.

4.Email Verification:
 Users need to verify their email by entering a verification code.

5.Password Strength Checker:
 Passwords are evaluated based on strength, and feedback is provided if they do not meet the required level of security.

6.JWT Authentication: 
JSON Web Tokens are used for session management and securing routes.

7.Email Notifications:
 OTPs and verification codes are sent using Nodemailer through Gmail.



## Technologies or frameworks  Used

**React (Frontend)**
- React: A JavaScript library for building user interfaces.The user interface is built using React to provide a dynamic and interactive experience.
- React Hooks:Used for managing state and side effects.
- React Router:For navigation between different pages (Signup, Login, Reset  Password, etc.).
- Axios: To make HTTP requests to the backend API.
- CSS: For styling and responsive UI.

**Backend (Node.js/Express)**

- Node.js:  Server-side JavaScript runtime.
- Express:  Web framework for building the API.
- MongoDB:  NoSQL database for storing user data.
- Mongoose:  ODM (Object Data Modeling) library for MongoDB.
- bcrypt:  For hashing passwords.
- JWT (JSON Web Token):  For secure user authentication and session management.
- Nodemailer:   For sending password reset and verification emails.
- crypto:  Used to generate random verification codes for password reset.
- dotenv:  For environment variable management.
- CORS:    Middleware to allow cross-origin resource sharing.

## Prerequisites
**Installation**
- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)


## Setup of project 
-Download the repository or create project to  local system.

-Install the necessary packages with preferred package manager.

-Set up a .env file in the main folder and configure the required environment variables, such as your MongoDB connection string, email settings for Nodemailer, JWT secret key, and token expiry duration.

-Launch the app and verify that the server is operating correctly on the specified port.



## Endpoints / API
**User Signup**
Endpoint: POST /signup
**User Login**
Endpoint: POST /login
**OTP Verification**
Endpoint: POST /verify-otp
**Forgot Password**
Endpoint: POST /forgetpassword
**Reset Password**
Endpoint: POST /resetpassword
**Email Verification**
Endpoint: POST /emailverification

This README provides an overview of the system and guides users on setting it up and using its features. 