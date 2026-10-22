const express = require('express');
const path = require('path');
require('dotenv').config();
const { listTasks, createTask, updateTask, deleteTask } = require('./lib/tasks');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/tasks', async (req, res) => {
  try {
    res.json(await listTasks());
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    res.status(201).json(await createTask(req.body || {}));
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    res.json(await updateTask(req.params.id, req.body || {}));
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await deleteTask(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// 本地预览生产构建
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
