const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    minlength: [5, "Username must be at least 5 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [12, "Password must be at least 12 characters long"],
  },
  resetPasswordCode: Number,
  resetPasswordExpires: Date,
  otp: {
    type: Number,
    
  },
  otpExpires: {
    type: Date,
    
  }
}, {
  timestamps: true
});

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
 
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to set OTP
UserSchema.methods.setOTP = function() {
  this.otp = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit OTP
  this.otpExpires = Date.now() + 300000; // OTP expires in 5 minutes
  return this.otp;
};

// Method to clear OTP
UserSchema.methods.clearOTP = function() {
  this.otp = Number;
  this.otpExpires = Date;
};

// Method to verify OTP
UserSchema.methods.verifyOTP = function(otp) {
  return this.otp === parseInt(otp) && this.otpExpires > Date.now();
};

module.exports = mongoose.model("User", UserSchema);
