const { models } = require("mern-db-layer");
const { Todo } = models;
const path = require("path");

// Get all todos for a specific user
exports.getTodos = async (req, res) => {
  const { userId } = req.params;
  try {
    const todos = await Todo.find({ userId });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos", message: err.message });
  }
};

// Add a new todo (with image filename)
exports.addTodo = async (req, res) => {
  const { title, userId } = req.body;

  if (!title || !userId) return res.status(400).json({ error: "Title and userId required" });

  let imageFilename = null;
  if (req.file) {
    imageFilename = req.file.filename; // Get the filename from multer diskStorage
  }

  try {
    const newTask = await Todo.create({
      title,
      userId,
      image: imageFilename, // Save the filename
    });

    res.status(201).json(newTask); // Sending the newly created task
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: "Failed to add todo", message: err.message });
  }
};

// Delete a todo by ID
exports.deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Todo.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Todo not found" });
    res.json({ message: "Deleted", task: deleted });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo", message: err.message });
  }
};

// Serve local image by its filename
exports.getImage = async (req, res) => {
  const { id } = req.params;
  const imagePath = path.join(__dirname, '../../uploads', id); // Construct the path to the local file

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error("Error serving image:", err);
      if (err.code === 'ENOENT') {
        return res.status(404).send('Image not found');
      }
      return res.status(500).send('Error serving image');
    }
    console.log("Image served:", imagePath);
  });
};
