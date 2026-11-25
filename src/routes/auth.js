const express = require('express');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();
const UserView = require('../views/user');

console.log("Auth Routes Carregado");

router.post('/users', UserView.create);
router.post('/auth/login', UserView.login);

router.get('/users', authMiddleware, UserView.getAll);
router.get('/users/:id', authMiddleware, UserView.getById);
router.put('/users/:id', authMiddleware, UserView.update);
router.delete('/users/:id', authMiddleware, UserView.delete);

module.exports = router;
