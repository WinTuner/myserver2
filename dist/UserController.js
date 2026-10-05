"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const User_1 = __importDefault(require("./User"));
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = new User_1.default({ name, email, password });
        await newUser.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
    }
};
exports.createUser = createUser;
const getUsers = async (req, res) => {
    try {
        const users = await User_1.default.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const patch = {};
        if (name !== undefined)
            patch.name = name;
        if (email !== undefined)
            patch.email = email;
        if (password !== undefined && password !== '')
            patch.password = password;
        const updatedUser = await User_1.default.findByIdAndUpdate(id, patch, {
            new: true,
            runValidators: true,
        });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User_1.default.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
    }
};
exports.deleteUser = deleteUser;
