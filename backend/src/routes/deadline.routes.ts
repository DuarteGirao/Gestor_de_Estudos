import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getAllDeadline, createDeadline, updateDeadline, deleteDeadline } from '../controllers/deadline.controller';

const router = Router();

router.get('/', authenticate, getAllDeadline);
router.post('/', authenticate, createDeadline);
router.put('/:id', authenticate, updateDeadline);
router.delete('/:id', authenticate, deleteDeadline);  

export default router;