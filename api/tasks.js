const { listTasks, createTask } = require('../lib/tasks');

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const tasks = await listTasks();
      return res.status(200).json(tasks);
    }

    if (req.method === 'POST') {
      const task = await createTask(req.body || {});
      return res.status(201).json(task);
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: '不支持的请求方法' });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};
