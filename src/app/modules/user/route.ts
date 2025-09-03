import { Router } from 'express';
import { userController } from './controller';


const router = Router();

router.post('/register',userController.createUser);
router.get('/', userController.getUsers);
router.get('/countries', userController.getCountries);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export const userRoutes = router;