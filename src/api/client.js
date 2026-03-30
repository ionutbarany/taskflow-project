const API_BASE =
  (typeof window !== 'undefined' && window.TASKFLOW_API_BASE) ||
  'http://localhost:3000/api/v1';

function tasksPath(suffix = '') {
  return `${API_BASE}/tasks${suffix}`;
}

async function handleResponse(res) {
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: 'Respuesta no válida del servidor' };
    }
  }

  if (!res.ok) {
    const msg =
      (data && data.error) ||
      (res.status >= 500
        ? 'Error interno del servidor'
        : res.status === 400
          ? 'Solicitud incorrecta'
          : res.statusText || 'Error');
    const err = new Error(msg);
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}

export async function fetchTasks() {
  const res = await fetch(tasksPath('/'), {
    headers: { Accept: 'application/json' },
  });
  return handleResponse(res);
}

export async function createTask(payload) {
  const res = await fetch(tasksPath('/'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateTask(id, payload) {
  const res = await fetch(tasksPath(`/${id}`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteTask(id) {
  const res = await fetch(tasksPath(`/${id}`), {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  });
  if (res.status === 204) return;
  await handleResponse(res);
}
