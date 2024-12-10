import express from 'express';

import { createUser } from 'src/controllers/userController.js';

const router = express.Router();

router.post('/', (req, res, next) => {
  createUser(req, res, next).catch(next);
});


export default router;