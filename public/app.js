const apiBase =
  window.APP_API_BASE_URL || `${window.location.protocol}//${window.location.host}/api`

const tasksListEl = document.getElementById('tasks-list')
const formEl = document.getElementById('task-form')
const messageEl = document.getElementById('form-message')
const refreshBtn = document.getElementById('refresh-btn')
const apiBaseUrlEl = document.getElementById('api-base-url')

apiBaseUrlEl.textContent = `${apiBase}/tasks`

async function fetchTasks () {
  try {
    const res = await fetch(`${apiBase}/tasks`)
    if (!res.ok) {
      throw new Error(`Failed to fetch tasks: ${res.status}`)
    }
    const data = await res.json()
    renderTasks(data)
  } catch (err) {
    console.error(err)
    tasksListEl.innerHTML =
      '<p class="empty-state">Failed to load tasks. Check if the API is running.</p>'
  }
}

function formatDate (value) {
  if (!value) return 'No due date'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return 'Invalid date'
  return d.toLocaleDateString()
}

function renderTasks (tasks) {
  if (!tasks.length) {
    tasksListEl.innerHTML =
      '<p class="empty-state">No tasks yet. Create one to get started.</p>'
    return
  }

  tasksListEl.innerHTML = ''

  for (const task of tasks) {
    const item = document.createElement('div')
    item.className = 'task-item'

    const statusClass = {
      'in-progress': 'status-in-progress',
      done: 'status-done',
      todo: 'status-todo'
    }[task.status] || 'status-todo'

    item.innerHTML = `
      <div class="task-main">
        <div class="task-title">${task.title}</div>
        ${
          task.description
            ? `<div class="task-description">${task.description}</div>`
            : ''
        }
      </div>
      <div class="task-meta">
        <div>
          <span class="status-pill ${statusClass}">${task.status}</span>
        </div>
        <div>Due: ${formatDate(task.dueDate)}</div>
        <div>Created: ${formatDate(task.createdAt)}</div>
      </div>
      <div class="task-actions">
        <button class="btn-icon" data-action="cycle" data-id="${task._id}">Next status</button>
        <button class="btn-icon" data-action="delete" data-id="${task._id}">Delete</button>
      </div>
    `

    tasksListEl.appendChild(item)
  }
}

async function createTask (payload) {
  const res = await fetch(`${apiBase}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Failed to create task (${res.status})`)
  }

  return res.json()
}

async function updateTask (id, updates) {
  const res = await fetch(`${apiBase}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Failed to update task (${res.status})`)
  }

  return res.json()
}

async function deleteTask (id) {
  const res = await fetch(`${apiBase}/tasks/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Failed to delete task (${res.status})`)
  }
}

function cycleStatus (current) {
  if (current === 'todo') return 'in-progress'
  if (current === 'in-progress') return 'done'
  return 'todo'
}

formEl.addEventListener('submit', async (e) => {
  e.preventDefault()
  messageEl.textContent = ''
  messageEl.className = 'message'

  const formData = new FormData(formEl)
  const title = formData.get('title')?.trim()
  const description = formData.get('description')?.trim()
  const status = formData.get('status')
  const dueDate = formData.get('dueDate')

  if (!title) {
    messageEl.textContent = 'Title is required'
    messageEl.classList.add('error')
    return
  }

  try {
    await createTask({
      title,
      description: description || undefined,
      status,
      dueDate: dueDate || undefined
    })

    messageEl.textContent = 'Task created'
    messageEl.classList.add('success')
    formEl.reset()
    await fetchTasks()
  } catch (err) {
    console.error(err)
    messageEl.textContent = err.message
    messageEl.classList.add('error')
  }
})

refreshBtn.addEventListener('click', () => {
  fetchTasks()
})

tasksListEl.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action]')
  if (!btn) return

  const id = btn.dataset.id
  const action = btn.dataset.action

  if (action === 'delete') {
    if (!window.confirm('Delete this task?')) return
    try {
      await deleteTask(id)
      await fetchTasks()
    } catch (err) {
      console.error(err)
      window.alert('Failed to delete task')
    }
  } else if (action === 'cycle') {
    const item = btn.closest('.task-item')
    const pill = item?.querySelector('.status-pill')
    const currentStatus = pill?.textContent?.trim() || 'todo'
    const nextStatus = cycleStatus(currentStatus)

    try {
      await updateTask(id, { status: nextStatus })
      await fetchTasks()
    } catch (err) {
      console.error(err)
      window.alert('Failed to update task')
    }
  }
})

await fetchTasks()
