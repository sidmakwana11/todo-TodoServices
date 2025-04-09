const express = require('express');
const { getTodos, addTodo, deleteTodo } = require('../controllers/todoController');
const router = express.Router();

router.get('/todo/:userId', getTodos);
router.post('/todo/new', addTodo);
router.delete('/todo/delete/:id', deleteTodo);

module.exports = router;
