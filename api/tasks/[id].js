const { updateTask, deleteTask } = require('../../lib/tasks');

module.exports = async (req, res) => {
  const id = req.query.id;

  try {
    if (req.method === 'PATCH' || req.method === 'PUT') {
      const task = await updateTask(id, req.body || {});
      return res.status(200).json(task);
    }

    if (req.method === 'DELETE') {
      await deleteTask(id);
      return res.status(204).end();
    }

    res.setHeader('Allow', 'PATCH, DELETE');
    return res.status(405).json({ error: '不支持的请求方法' });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};
