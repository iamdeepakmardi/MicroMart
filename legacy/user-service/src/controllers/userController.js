import * as userService from "../services/userService.js";

export const registerUser = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { token, user } = await userService.loginUser(req.body);
    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await userService.updateUserProfile(req.user._id, req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
