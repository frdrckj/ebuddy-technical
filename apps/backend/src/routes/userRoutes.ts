import { Router } from 'express';
import { fetchUserData, updateUserData } from '../controllers/api';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/fetch-user-data', fetchUserData);
router.post('/update-user-data', updateUserData);

export default router;
