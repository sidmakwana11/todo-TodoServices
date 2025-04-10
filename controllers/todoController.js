const { Todo } = require("mern-db-layer");

exports.getTodos = async (req, res) => {
  const { userId } = req.params;
  const todos = await Todo.find({ userId });
  res.json(todos);
};

exports.addTodo = async (req, res) => {
  const { title, userId } = req.body;
  if (!title || !userId) return res.status(400).json({ error: "Title and userId required" });

  const newTask = await Todo.create({ title, userId });
  res.status(201).json(newTask);
};

exports.deleteTodo = async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ error: "Task not found" });

  res.json({ message: "Task deleted", task: result });
};
