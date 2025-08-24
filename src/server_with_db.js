const express = require("express");
const pool = require("./db");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, message: "API is up" });
});

app.get("/tasks", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM tasks");
  res.json(rows);
});

app.post("/tasks", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "title is required" });

  const [result] = await pool.query(
    "INSERT INTO tasks (title, done) VALUES (?, ?)",
    [title, false]
  );

  const [rows] = await pool.query("SELECT * FROM tasks WHERE id=?", [result.insertId]);
  res.status(201).json(rows[0]);
});

// ✅ Update a task (PATCH)
app.patch("/tasks/:id", async (req, res) => {
  const { title, done } = req.body;
  const id = req.params.id;

  const [rows] = await pool.query("SELECT * FROM tasks WHERE id=?", [id]);
  if (rows.length === 0) return res.status(404).json({ error: "not found" });

  const task = rows[0];

  await pool.query(
    "UPDATE tasks SET title=?, done=?, updatedAt=NOW() WHERE id=?",
    [title ?? task.title, done ?? task.done, id]
  );

  const [updated] = await pool.query("SELECT * FROM tasks WHERE id=?", [id]);
  res.json(updated[0]);
});

app.put("/tasks/:id", async (req, res) => {
  const { title, done } = req.body;
  const id = req.params.id;

  if (title === undefined || done === undefined) {
    return res.status(400).json({ error: "title and done are required" });
  }

  const [rows] = await pool.query("SELECT * FROM tasks WHERE id=?", [id]);
  if (rows.length === 0) return res.status(404).json({ error: "not found" });

  await pool.query(
    "UPDATE tasks SET title=?, done=?, updatedAt=NOW() WHERE id=?",
    [title, done, id]
  );

  const [updated] = await pool.query("SELECT * FROM tasks WHERE id=?", [id]);
  res.json(updated[0]);
});

app.delete("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  const [rows] = await pool.query("SELECT * FROM tasks WHERE id=?", [id]);
  if (rows.length === 0) return res.status(404).json({ error: "not found" });

  await pool.query("DELETE FROM tasks WHERE id=?", [id]);
  res.json(rows[0]);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
