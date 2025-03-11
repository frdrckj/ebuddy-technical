import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebaseConfig';

// Extend the Express Request interface to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
        role?: string;
      };
    }
  }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  console.log("authmiddleware is running");
  const authHeader = req.headers.authorization;
  console.log('🔍 Auth Header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: No token provided'
    });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    console.log('Decoded Token:', decodedToken);

    // Attach user info to the request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      role: decodedToken.role || 'user'
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token'
    });
  }
};

export default authMiddleware;
