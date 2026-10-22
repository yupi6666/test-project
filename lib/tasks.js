const { getSupabase } = require('./supabase');

async function listTasks() {
  const { data, error } = await getSupabase()
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

async function createTask({ title, priority }) {
  if (!title || String(title).trim() === '') {
    const err = new Error('任务标题不能为空');
    err.status = 400;
    throw err;
  }

  const { data, error } = await getSupabase()
    .from('tasks')
    .insert([{ title: String(title).trim(), priority: priority || '中' }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

async function updateTask(id, updates) {
  const allowed = {};
  if (typeof updates.title === 'string') allowed.title = updates.title.trim();
  if (['高', '中', '低'].includes(updates.priority)) allowed.priority = updates.priority;
  if (typeof updates.completed === 'boolean') allowed.completed = updates.completed;

  if (Object.keys(allowed).length === 0) {
    const err = new Error('没有可更新的字段');
    err.status = 400;
    throw err;
  }

  const { data, error } = await getSupabase()
    .from('tasks')
    .update(allowed)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

async function deleteTask(id) {
  const { error } = await getSupabase().from('tasks').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

module.exports = { listTasks, createTask, updateTask, deleteTask };
