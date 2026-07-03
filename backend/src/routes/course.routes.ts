import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getAllCourses, createCourse, updateCourse, deleteCourse} from '../controllers/course.controller';

const router = Router();

router.get('/', authenticate, getAllCourses);
router.post('/', authenticate, createCourse);
router.put('/:id', authenticate, updateCourse);
router.delete('/:id', authenticate, deleteCourse);

export default router;