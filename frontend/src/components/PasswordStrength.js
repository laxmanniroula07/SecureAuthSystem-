
const zxcvbn = require('zxcvbn');

const checkPasswordStrength = (password) => {
  const result = zxcvbn(password);
  return result.score;
};

const getPasswordFeedback = (password) => {
  const result = zxcvbn(password);
  let feedback = result.feedback.warning || '';

  if (password.length < 12) {
    feedback += ' Password should be at least 12 characters long.';
  }
  if (!/[A-Z]/.test(password)) {
    feedback += ' Include at least one uppercase letter.';
  }
  if (!/[a-z]/.test(password)) {
    feedback += ' Include at least one lowercase letter.';
  }
  if (!/[0-9]/.test(password)) {
    feedback += ' Include at least one number.';
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    feedback += ' Include at least one special character.';
  }

  return feedback.trim();
};

const getPasswordStrengthText = (score) => {
  switch (score) {
    case 0: return 'Very Weak';
    case 1: return 'Weak';
    case 2: return 'Fair';
    case 3: return 'Strong';
    case 4: return 'Very Strong';
    
  }
};

module.exports = {
  checkPasswordStrength,
  getPasswordFeedback,
  getPasswordStrengthText
};



