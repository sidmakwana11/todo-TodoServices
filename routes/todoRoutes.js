const express = require("express");
const {
    getTodos,
    addTodo: addTodoController, 
    deleteTodo,
} = require("../controllers/todoController");
const upload = require("../middlewares/upload");

const { models } = require("mern-db-layer");
const { Todo } = models;

const router = express.Router();

// Serve static images from the 'uploads' directory
const path = require('path');
router.use('/image', express.static(path.join(__dirname, '../uploads'))); // Adjusted route path to '/image'

// Routes
router.get("/todo/:userId", getTodos);

// This will handle both text and optional image
router.post("/todo/new", upload.single("image"), async (req, res) => {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    try {
        const { title, userId } = req.body;
        let imagePath = null;

        // If an image is uploaded, get the path; otherwise, set it to null
        if (req.file) {
            imagePath = req.file.path;
            console.log("Image uploaded successfully. File path:", imagePath);
        }

        // If no image, don't pass imagePath to the Todo model
        const newTodo = new Todo({
            title,
            userId,
            image: imagePath ? path.basename(imagePath) : null  // If imagePath is null, save null in DB
        });

        console.log("newTodo:", newTodo);

        await newTodo.save();
        console.log("Todo saved to database:", newTodo);
        res.status(201).json(newTodo);
    } catch (error) {
        console.error("Error creating todo:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    } finally {
        console.log("--- /todo/new request completed ---");
    }
});


router.delete("/todo/delete/:id", deleteTodo);
router.put("/todo/:id", async (req, res) => {
    const { models } = require("mern-db-layer");
    const { Todo } = models;

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title: req.body.title },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.json(updatedTodo);
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).json({ error: "Failed to update todo", message: err.message });
    }
});

// POST /upload - handle cropped image upload for existing task
router.post("/upload", upload.single("image"), async (req, res) => {
    try {
        const { taskId } = req.body;
        if (!req.file || !taskId || taskId === "null" || taskId === "undefined") {
            return res.status(400).json({ error: "Image and valid taskId are required." });
        }        

        const imagePath = path.basename(req.file.path); // just the filename
        console.log("Received cropped image:", imagePath);

        // Update the Todo with new image
        const updatedTodo = await Todo.findByIdAndUpdate(
            taskId,
            { image: imagePath ? path.basename(imagePath) : null },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.status(200).json({ message: "Image updated successfully", imagePath });
    } catch (err) {
        console.error("Error uploading cropped image:", err);
        res.status(500).json({ error: "Failed to upload image", details: err.message });
    }
});


module.exports = router;