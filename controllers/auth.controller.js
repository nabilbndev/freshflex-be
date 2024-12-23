import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils/generateToken.js';
import User from "../models/user.model.js";
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    })
    if (newUser) {
      const token = generateToken(newUser._id);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        token: token
      })
    } else {
      res.status(400).json({ error: "Invalid user data" })
    }
  } catch (error) {
    console.log("Error in signup controller", error.message)
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    const token = generateToken(user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      token: token
    })
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(400).json({ error: "Internal Server Error" })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
