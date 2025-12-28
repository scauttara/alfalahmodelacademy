import { Router } from 'express';

import { createUser } from './user.controller.js';
import { getUser } from './user.controller.js';
import { updateUser } from './user.controller.js';
import { deleteUser } from './user.controller.js';
import { testUser } from './user.controller.js';
import { getAllUsers } from './user.controller.js';

const router = Router();
router.get('/test', testUser);
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);


export default router;