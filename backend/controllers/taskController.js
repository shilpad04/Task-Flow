import Task from "../models/taskModel.js";

// CREATE NEW TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;
    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      completed: completed === "Yes" || completed === true,
      owner: req.user.id,
    });

    const saved = await task.save();
    res.status(201).json({ success: true, task: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET ALL TASK FOR LOGGED IN USER
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });

    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET SINGLE TASK BY ID (BELONGED TO USER)

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });

    if (!task)
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });

    res.json({ success: true, task });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE A TASK
export const updateTask = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.completed !== undefined) {
      data.completed = data.completed === "Yes" || data.completed === true;
    }

    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      data,
      { new: true, runValidators: true },
    );

    if (!updated)
      return res.status(404).json({
        success: false,
        message: "Task not found or not yours",
      });
    res.json({ success: true, task: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE A TASK
export const deleteTask = async (req, res) => {
  try {
    console.log("----------- DELETE DEBUG -----------");

    console.log("PARAM ID:", req.params.id);
    console.log("USER OBJECT:", req.user);

    const taskBeforeDelete = await Task.findById(req.params.id);
    console.log("TASK IN DB:", taskBeforeDelete);

    const userId = req.user._id || req.user.id;
    console.log("USER ID USED IN QUERY:", userId);

    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: userId,
    });

    console.log("DELETE RESULT:", deleted);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Task not found or not yours",
      });
    }

    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};