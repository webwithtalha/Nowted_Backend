import express from 'express';

import { createUser, getUsers,deleteUser,getUserById,updateUser } from 'src/controllers/userController.js';

const router = express.Router();

router.post('/', (req, res, next) => {
  createUser(req, res, next).catch(next);
});
router.get('/', (req, res, next) => {
  getUsers(req, res, next).catch(next);
});

router.get('/:id', (req, res, next) => {
  getUserById(req, res, next).catch(next);
});

router.put('/:id', (req, res, next) => {
  updateUser(req, res, next).catch(next);
});

router.delete('/:id', (req, res, next) => {
  deleteUser(req, res, next).catch(next);
});


export default router;