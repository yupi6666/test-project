import { useEffect, useState } from 'react'

const API_URL = '/api'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('中')
  const [filter, setFilter] = useState('全部')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/tasks`)
      if (!res.ok) throw new Error('获取任务失败')
      const data = await res.json()
      setTasks(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, priority })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '添加失败')
      }
      setTitle('')
      setPriority('中')
      await fetchTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleCompleted = async (task) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      })
      if (!res.ok) throw new Error('更新失败')
      await fetchTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('删除失败')
      await fetchTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  const filteredTasks = filter === '全部'
    ? tasks
    : tasks.filter((t) => t.priority === filter)

  const formatTime = (iso) => {
    const date = new Date(iso)
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const priorityClass = {
    高: 'priority-high',
    中: 'priority-medium',
    低: 'priority-low'
  }

  return (
    <div className="container">
      <div className="header">
        <h1>智能任务管理系统</h1>
        <p>高效管理每一天的任务</p>
      </div>

      {error && <div className="error">{error}</div>}

      <form className="form" onSubmit={handleAdd}>
        <input
          className="input"
          type="text"
          placeholder="输入任务标题..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="高">高优先级</option>
          <option value="中">中优先级</option>
          <option value="低">低优先级</option>
        </select>
        <button className="btn btn-primary" type="submit">
          添加
        </button>
      </form>

      <div className="filter-bar">
        {['全部', '高', '中', '低'].map((p) => (
          <button
            key={p}
            className={`filter-btn ${filter === p ? 'active' : ''}`}
            onClick={() => setFilter(p)}
          >
            {p === '全部' ? '全部' : `${p}优先级`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty">
          {filter === '全部' ? '暂无任务，快去添加一条吧！' : `没有${filter}优先级的任务`}
        </div>
      ) : (
        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className="task-content">
                <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                  {task.title}
                </span>
                <div className="task-meta">
                  <span className={`priority ${priorityClass[task.priority]}`}>
                    {task.priority}
                  </span>
                  <span className="task-time">{formatTime(task.created_at)}</span>
                </div>
              </div>
              <div className="task-actions">
                <button
                  className={`btn-toggle ${task.completed ? 'completed' : ''}`}
                  onClick={() => toggleCompleted(task)}
                >
                  {task.completed ? '未完成' : '完成'}
                </button>
                <button
                  className="btn-delete"
                  onClick={() => deleteTask(task.id)}
                >
                  删除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
