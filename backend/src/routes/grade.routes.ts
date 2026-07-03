import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getAllGrade, createGrade, updateGrade, deleteGrade } from '../controllers/grade.controller';

const router = Router();

router.get('/', authenticate, getAllGrade);
router.post('/', authenticate, createGrade);
router.put('/:id', authenticate, updateGrade);
router.delete('/:id', authenticate, deleteGrade);

export default router;