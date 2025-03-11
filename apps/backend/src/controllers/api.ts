import { Request, Response } from 'express';
import { getUserById, updateUser, createUser } from '../repository/userCollection';

export const fetchUserData = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const userId = req.user.uid;
    const userData = await getUserById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateUserData = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const userId = req.user.uid;
    const userData = req.body;

    // Check if user exists
    const existingUser = await getUserById(userId);

    let updatedUser;

    if (!existingUser) {
      updatedUser = await createUser(userId, userData);
    } else {
      updatedUser = await updateUser(userId, userData);
    }

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'User data updated successfully'
    });
  } catch (error) {
    console.error('Error updating user data:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
