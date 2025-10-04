const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");

class AuthService {
  async registerUser(userData) {
    const { email, password, fullName } = userData;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists with this email");
    }

    // Create user
    const user = await User.create({
      email,
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    return {
      user: {
        id: user._id,
        email: user.email,
      },
      token,
    };
  }

  async loginUser(email, password) {
    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      throw new Error("Invalid email or password");
    }

    // Generate token
    const token = generateToken(user._id);

    return {
      user: {
        id: user._id,
        email: user.email,
      },
      token,
    };
  }

  async getCurrentUser(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user._id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async getUserProfile(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user._id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

module.exports = new AuthService();
