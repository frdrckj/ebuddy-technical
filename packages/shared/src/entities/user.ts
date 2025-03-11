export interface User {
    id: string;
    email: string;
    displayName: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    role: 'user' | 'admin';
    metadata?: Record<string, any>;
  }
