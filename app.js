/*------Toda la logica dinamica de la aplicacion--------*/

/*------Referencias al DOM-------*/ 

const listProgreso = document.getElementById("list-progreso");
const listPendiente = document.getElementById("list-pendiente");
const listCompletada = document.getElementById("list-completada");

const modal = document.getElementById("modal");
const modalTitulo = document.getElementById("modal-titulo");
const modalCategoria = document.getElementById("modal-categoria");
const modalPrioridad = document.getElementById("modal-prioridad");
const modalCancel = document.getElementById("modal-cancel");
const modalSave = document.getElementById("modal-save");

//Busqueda

const searchInput = document.getElementById("search-input") 

/*------- Datos iniciales ------- */

const tareasIniciales = [
  { id: 1, titulo: 'Hacer pedido suplementos',        categoria: '📋 Gestión',       prioridad: 'alta',  estado: 'progreso'   },
  { id: 2, titulo: 'Proyecto sistema Log In',          categoria: '💻 Desarrollo',    prioridad: 'media', estado: 'progreso'   },
  { id: 3, titulo: 'Revisar código proyecto TFG',      categoria: '💻 Desarrollo',    prioridad: 'media', estado: 'progreso'   },
  { id: 4, titulo: 'Preparar End Points para BBDD',    categoria: '💻 Desarrollo',    prioridad: 'alta',  estado: 'progreso'   },
  { id: 5, titulo: 'Investigar alternativas a Redux',  categoria: '📚 Investigación', prioridad: 'baja',  estado: 'progreso'   },
  { id: 6, titulo: 'Entrenar gimnasio',                categoria: '🏃 Deporte',       prioridad: 'alta',  estado: 'pendiente'  },
  { id: 7, titulo: 'Leer',                             categoria: '📚 Investigación', prioridad: 'baja',  estado: 'pendiente'  },
  { id: 8, titulo: 'Preparar documentación del TFG',   categoria: '📋 Gestión',       prioridad: 'media', estado: 'pendiente'  },
  { id: 9, titulo: 'Configurar GitHub',                categoria: '💻 Desarrollo',    prioridad: 'media', estado: 'completada' },
  { id: 10, titulo: 'Correr',                          categoria: '🏃 Deporte',       prioridad: 'baja',  estado: 'completada' },
  { id: 11, titulo: 'Crear App gestor de tareas',      categoria: '💻 Desarrollo',    prioridad: 'alta',  estado: 'completada' },
  { id: 12, titulo: 'Reunión equipo TFG',              categoria: '📋 Gestión',       prioridad: 'media', estado: 'completada' },
];

/*-------Carga LOCALSTORAGE--------*/

let tasks = cargarTareas();

function cargarTareas() {
  const guardadas = localStorage.getItem('taskflow-v2');
  return guardadas ? JSON.parse(guardadas) : tareasIniciales;
}

function guardarTareas() {
  localStorage.setItem('taskflow-v2', JSON.stringify(tasks));
}

/*-------Renderizado-------*/
 // Vaciamos las 3 listas del DOM
//

function renderizarTodo() {
  listProgreso.innerHTML   = '';
  listPendiente.innerHTML  = '';
  listCompletada.innerHTML = '';

  // Recorremos el array y pintamos cada tarea en su lista

  tasks.forEach(function(tarea) {
    const card = crearCard(tarea);

    if (tarea.estado === 'progreso')   listProgreso.appendChild(card);
    if (tarea.estado === 'pendiente')  listPendiente.appendChild(card);
    if (tarea.estado === 'completada') listCompletada.appendChild(card);
  });

  actualizarContadores();
  aplicarBusqueda();        // re-aplica el filtro de búsqueda si hay texto
}

/*-------Crear una Task-Card en el DOM--------*/

// Recibe un objeto tarea y construye el elemento HTML correspondiente.
// Mantiene exactamente la misma estructura que tenías en el HTML original.

function crearCard(tarea) {
  const div = document.createElement('div');
  div.classList.add('task-card');
  div.dataset.id = tarea.id;   // guardamos el id en data-id para referenciarlo

  if (tarea.estado === 'completada') {
    div.classList.add('done');
  }

  // Animación de entrada
  div.style.animation = 'cardEntrada 0.25s ease forwards';

  div.innerHTML = `
    <div class="task-card__check">${tarea.estado === 'completada' ? '✓' : ''}</div>
    <div class="task-card__body">
      <div class="task-card__top">
        <span class="task-card__title">${tarea.titulo}</span>
      </div>
      <div class="task-card__bottom">
        <span class="badge-category">${tarea.categoria}</span>
        <span class="badge-priority ${tarea.prioridad}">${capitalizar(tarea.prioridad)}</span>
      </div>
    </div>
    <button class="btn-delete" title="Eliminar tarea">×</button>
  `;

  // ── Evento: marcar como completada (click en la card) ──
  //
  // Cuando el usuario hace click en la card (pero NO en el botón de borrar):
  // - Si no estaba completada → pasa a "completada"
  // - Si ya estaba completada → vuelve a "pendiente"
  div.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-delete')) return; // ignorar si clicó borrar

    const t = tasks.find(t => t.id === tarea.id);
    t.estado = (t.estado === 'completada') ? 'pendiente' : 'completada';
    guardarTareas();
    renderizarTodo();
  });

  // ── Evento: eliminar tarea ──
  //
  // .find() localiza el objeto en el array.
  // .filter() devuelve un nuevo array SIN esa tarea.
  // Luego borramos el nodo del DOM con remove().
  const btnDelete = div.querySelector('.btn-delete');
  btnDelete.addEventListener('click', function(e) {
    e.stopPropagation(); // evita que también se dispare el click de la card

    tasks = tasks.filter(t => t.id !== tarea.id);
    guardarTareas();
    div.remove();
    actualizarContadores();
  });

  return div;
}

/*-------Añadir una nueva tarea------*/

let estadoParaNuevaTarea = 'pendiente'; // valor por defecto

// Seleccionamos TODOS los botones .section__add con querySelectorAll
// y les añadimos el evento a cada uno con forEach
document.querySelectorAll('.section__add').forEach(function(btn) {
  btn.addEventListener('click', function() {
    estadoParaNuevaTarea = btn.dataset.estado; // leemos en qué sección estamos
    abrirModal();
  });
});

function abrirModal() {
  modal.classList.remove('hidden');
  modalTitulo.value = '';
  modalTitulo.focus();
}

function cerrarModal() {
  modal.classList.add('hidden');
}

// Botón Cancelar → cierra el modal sin hacer nada
modalCancel.addEventListener('click', cerrarModal);

// Click fuera del modal → también cierra
modal.addEventListener('click', function(e) {
  if (e.target === modal) cerrarModal();
});

// Botón "Añadir tarea" → crea la tarea y la guarda
modalSave.addEventListener('click', function() {
  const titulo = modalTitulo.value.trim();
  if (!titulo) {
    modalTitulo.style.borderColor = 'var(--color-danger)';
    setTimeout(() => { modalTitulo.style.borderColor = ''; }, 1000);
    return;
  }

  // Construimos el objeto tarea nuevo
  const nuevaTarea = {
    id:        Date.now(),                   // timestamp como ID único
    titulo:    titulo,
    categoria: modalCategoria.value,
    prioridad: modalPrioridad.value,
    estado:    estadoParaNuevaTarea
  };

  tasks.push(nuevaTarea);
  guardarTareas();
  cerrarModal();
  renderizarTodo();
});

// Enter en el input del modal también guarda
modalTitulo.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') modalSave.click();
  if (e.key === 'Escape') cerrarModal();
});

/*-------Buscador de tareas------*/

searchInput.addEventListener('input', aplicarBusqueda);

function aplicarBusqueda() {
  const query = searchInput.value.toLowerCase().trim();

  document.querySelectorAll('.task-card').forEach(function(card) {
    const titulo = card.querySelector('.task-card__title').textContent.toLowerCase();
    // Si el título contiene la búsqueda → visible; si no → oculta
    card.classList.toggle('hidden', query !== '' && !titulo.includes(query));
  });
}

/*-------Actualizar contadores y estadisticas-------*/

function actualizarContadores() {
  const total      = tasks.length;
  const completadas = tasks.filter(t => t.estado === 'completada').length;
  const progreso   = tasks.filter(t => t.estado === 'progreso').length;
  const pendiente  = tasks.filter(t => t.estado === 'pendiente').length;
  const alta       = tasks.filter(t => t.prioridad === 'alta').length;

  // Sidebar - vistas
  setText('count-todas',     total);
  setText('count-progreso',  progreso);
  setText('count-completada', completadas);
  setText('count-alta',      alta);

  // Sidebar - categorías
  ['Desarrollo', 'Deporte', 'Gestión', 'Investigación'].forEach(function(cat) {
    const n = tasks.filter(t => t.categoria.includes(cat)).length;
    setText('count-' + cat, n);
  });

  // Labels de sección
  setText('label-progreso',  progreso  + (progreso  === 1 ? ' tarea' : ' tareas'));
  setText('label-pendiente', pendiente + (pendiente === 1 ? ' tarea' : ' tareas'));
  setText('label-completada', completadas + (completadas === 1 ? ' tarea' : ' tareas'));

  // Estadísticas
  setText('stat-completadas', completadas + ' / ' + total);
  setText('stat-alta', alta);
  setText('header-meta', pendiente + ' pendiente' + (pendiente !== 1 ? 's' : ''));

  // Barra de progreso
  const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;
  const fill = document.getElementById('progress-fill');
  if (fill) fill.style.width = porcentaje + '%';
}

// Pequeña función auxiliar para no repetir getElementById + textContent
function setText(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor;
}

function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/*-------Arranque-------*/

// Llamamos a renderizarTodo() una sola vez al cargar la página.
// Esto pinta todas las tareas del array (leídas de localStorage o las iniciales).

renderizarTodo();
