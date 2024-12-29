import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/home.css";
import photo from "../assets/photo.jpeg";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };
  return (
    <>
      <div className="home">
        <h2>Welcome to the Advanced CyberSecurity System Design Project</h2>
        <span><button className="logout" onClick={handleLogout} >Logout</button></span>
        <div className="cybersecurity-info">
          <img src={photo} alt="Security Illustration" />

          <p>
            This project presents a secure system prototype, highlighting the
            core principles of cybersecurity in user registration. Key features
            include an advanced password strength checker, providing users with
            real-time feedback to enhance their account security. Additionally,
            a CAPTCHA is implemented to verify human interaction, ensuring
            protection against bot-driven registrations. By incorporating best
            practices such as encryption and secure protocols, the system is
            designed to minimize risks and protect user data. This project
            showcases a thoughtful approach to cybersecurity, offering a
            user-friendly yet highly secure registration process that aligns
            with modern digital security needs.
          </p>
        </div>
        <div className="cybersecurity-tips">
          <h2>
            How does enabling multi-factor authentication (MFA) enhance the
            security of user accounts?
          </h2>
          <p>
            Here are some top cybersecurity tips to enhance your digital
            security:
          </p>
          <ol>
            <li>
              Use Strong, Unique Passwords: Ensure your passwords are long,
              complex, and different for each account. Use a combination of
              letters, numbers, and symbols.
            </li>
            <li>
              Enable Multi-Factor Authentication (MFA): Add an extra layer of
              security by requiring a second form of verification, such as a
              code sent to your phone.
            </li>
            <li>
              Keep Software Updated: Regularly update your operating systems,
              apps, and antivirus software to protect against the latest
              vulnerabilities and threats.
            </li>
            <li>
              Be Wary of Phishing Scams: Avoid clicking on suspicious links or
              downloading attachments from unverified sources. Always verify the
              sender's identity.
            </li>
            <li>
              Secure Your Wi-Fi: Use a strong password for your home or business
              Wi-Fi and ensure your network is encrypted (WPA3 if available).
            </li>
            <li>
              Backup Your Data: Regularly back up important files to an external
              drive or secure cloud storage in case of data loss from
              cyberattacks or system failures.
            </li>
            <li>
              Use Encryption: Encrypt sensitive data, especially when sending
              over the internet or storing it on devices to prevent unauthorized
              access.
            </li>
            <li>
              Limit Access to Critical Information: Only share sensitive
              information on a need-to-know basis and restrict access to vital
              systems.
            </li>
            <li>
              Monitor Account Activity: Regularly review your account activity
              for any suspicious transactions or unauthorized access.
            </li>
            <li>
              Educate Yourself and Your Team: Stay informed about common
              cybersecurity threats and best practices to build a culture of
              security awareness.
            </li>
          </ol>
        </div>
      </div>
    </>
  );
};

export default Home;
