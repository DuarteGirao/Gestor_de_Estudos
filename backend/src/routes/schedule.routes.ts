import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getAllSchedule, deleteSchedule, updateSchedule, createSchedule } from '../controllers/schedule.controller';

const router = Router();

router.get('/', authenticate, getAllSchedule);
router.post('/', authenticate, createSchedule);
router.put('/:id', authenticate, updateSchedule);
router.delete('/:id', authenticate, deleteSchedule);

export default router;