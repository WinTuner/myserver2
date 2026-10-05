import { Request, Response } from 'express';
import User from './User';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    return !user
      ? res.status(404).json({ error: 'User not found' })
      : res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...(name !== undefined ? { name } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(password ? { password } : {}),
      },
      { new: true, runValidators: true },
    );
    return !updatedUser
      ? res.status(404).json({ error: 'User not found' })
      : res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    return !deletedUser
      ? res.status(404).json({ error: 'User not found' })
      : res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
};
