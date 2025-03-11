import { db } from '../config/firebaseConfig';
import { User } from '@monorepo/shared';

const COLLECTION_NAME = 'USERS';
const usersCollection = db.collection(COLLECTION_NAME);

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await usersCollection.doc(userId).get();

    if (!userDoc.exists) {
      return null;
    }

    return { id: userDoc.id, ...userDoc.data() } as User;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<Omit<User, 'id'>>): Promise<User> => {
  try {
    // Add timestamp
    const updatedData = {
      ...userData,
      updatedAt: new Date().toISOString()
    };

    await usersCollection.doc(userId).update(updatedData);

    const updatedUser = await getUserById(userId);

    if (!updatedUser) {
      throw new Error('Failed to retrieve updated user');
    }

    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const createUser = async (userId: string, userData: Partial<Omit<User, 'id'>>): Promise<User> => {
  try {
    const timestamp = new Date().toISOString();

    const newUser: Omit<User, 'id'> = {
      email: userData.email || '',
      displayName: userData.displayName || '',
      createdAt: timestamp,
      updatedAt: timestamp,
      isActive: true,
      role: userData.role || 'user',
      metadata: userData.metadata || {},
    };

    await usersCollection.doc(userId).set(newUser);

    return { id: userId, ...newUser } as User;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
