//  TASKFLOW — app.js



// ─── DARK MODE ───────────────────────────────────────────────
//
// En vez de cambiar un emoji, ahora mostramos/ocultamos los dos
// SVGs que están en el HTML: #icon-moon y #icon-sun.

const html        = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const iconMoon    = document.getElementById('icon-moon');
const iconSun     = document.getElementById('icon-sun');

/**
 * Sincroniza los iconos del selector de tema con la clase `dark` en `<html>`,
 * alternando la visibilidad de luna/sol y actualizando el `title` del botón.
 */
function actualizarIconoTema() {
  const esModoOscuro = html.classList.contains('dark');
  // Modo oscuro activo → mostramos la luna (para ir a claro)
  // Modo claro activo  → mostramos el sol (para ir a oscuro)
  iconMoon.classList.toggle('hidden', !esModoOscuro);
  iconSun.classList.toggle('hidden',   esModoOscuro);
  themeToggle.title = esModoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
}

themeToggle.addEventListener('click', function() {
  html.classList.toggle('dark');
  const esModoOscuro = html.classList.contains('dark');
  localStorage.setItem('tf-theme', esModoOscuro ? 'dark' : 'light');
  actualizarIconoTema();
});

actualizarIconoTema();


// ─── REFERENCIAS AL DOM ───

const listProgreso   = document.getElementById('list-progreso');
const listPendiente  = document.getElementById('list-pendiente');
const listCompletada = document.getElementById('list-completada');

const modal          = document.getElementById('modal');
const modalTitulo    = document.getElementById('modal-titulo');
const modalCategoria = document.getElementById('modal-categoria');
const modalPrioridad = document.getElementById('modal-prioridad');
const modalCancel    = document.getElementById('modal-cancel');
const modalSave      = document.getElementById('modal-save');

const searchInput    = document.getElementById('search-input');


// ─── DATOS INICIALES ───

/**
 * Conjunto de tareas iniciales utilizado como estado por defecto cuando
 * no hay datos válidos guardados en `localStorage`.
 *
 * @type {Array<{id:number, titulo:string, categoria:string, prioridad:string, estado:string}>}
 */
const tareasIniciales = [
  { id: 1,  titulo: 'Hacer pedido suplementos',       categoria: '📋 Gestión',       prioridad: 'alta',  estado: 'progreso'   },
  { id: 2,  titulo: 'Proyecto sistema Log In',         categoria: '💻 Desarrollo',    prioridad: 'media', estado: 'progreso'   },
  { id: 3,  titulo: 'Revisar código proyecto TFG',     categoria: '💻 Desarrollo',    prioridad: 'media', estado: 'progreso'   },
  { id: 4,  titulo: 'Preparar End Points para BBDD',   categoria: '💻 Desarrollo',    prioridad: 'alta',  estado: 'progreso'   },
  { id: 5,  titulo: 'Investigar alternativas a Redux', categoria: '📚 Investigación', prioridad: 'baja',  estado: 'progreso'   },
  { id: 6,  titulo: 'Entrenar gimnasio',               categoria: '🏃 Deporte',       prioridad: 'alta',  estado: 'pendiente'  },
  { id: 7,  titulo: 'Leer',                            categoria: '📚 Investigación', prioridad: 'baja',  estado: 'pendiente'  },
  { id: 8,  titulo: 'Preparar documentación del TFG',  categoria: '📋 Gestión',       prioridad: 'media', estado: 'pendiente'  },
  { id: 9,  titulo: 'Configurar GitHub',               categoria: '💻 Desarrollo',    prioridad: 'media', estado: 'completada' },
  { id: 10, titulo: 'Correr',                          categoria: '🏃 Deporte',       prioridad: 'baja',  estado: 'completada' },
  { id: 11, titulo: 'Crear App gestor de tareas',      categoria: '💻 Desarrollo',    prioridad: 'alta',  estado: 'completada' },
  { id: 12, titulo: 'Reunión equipo TFG',              categoria: '📋 Gestión',       prioridad: 'media', estado: 'completada' },
];


// ─── LOCALSTORAGE ───

let tasks = cargarTareas();

/**
 * Carga las tareas almacenadas en `localStorage` bajo la clave `taskflow-v2`.
 * Si no existen o el formato es inválido, devuelve `tareasIniciales`.
 *
 * @returns {Array<{id:number, titulo:string, categoria:string, prioridad:string, estado:string}>}
 * Lista de tareas que se usará como estado de la aplicación.
 */
function cargarTareas() {
  const guardadas = localStorage.getItem('taskflow-v2');
  if (!guardadas) return tareasIniciales;

  try {
    const parsed = JSON.parse(guardadas);
    // Si por algún motivo el formato no es el esperado, volvemos al estado inicial
    return Array.isArray(parsed) ? parsed : tareasIniciales;
  } catch {
    console.warn('TaskFlow: datos corruptos en localStorage, se restauran tareas iniciales');
    return tareasIniciales;
  }
}

/**
 * Guarda el array global `tasks` en `localStorage` (clave `taskflow-v2`)
 * serializándolo en formato JSON.
 */
function guardarTareas() {
  localStorage.setItem('taskflow-v2', JSON.stringify(tasks));
}


// ─── RENDERIZADO ───

/**
 * Vuelve a pintar todas las listas de tareas en el DOM a partir de
 * `tasks`. Limpia las columnas, crea nuevas cards, actualiza contadores
 * y aplica el filtro de búsqueda actual.
 */
function renderizarTodo() {
  listProgreso.innerHTML   = '';
  listPendiente.innerHTML  = '';
  listCompletada.innerHTML = '';

  tasks.forEach(function(tarea) {
    const card = crearCard(tarea);
    if (tarea.estado === 'progreso')   listProgreso.appendChild(card);
    if (tarea.estado === 'pendiente')  listPendiente.appendChild(card);
    if (tarea.estado === 'completada') listCompletada.appendChild(card);
  });

  actualizarContadores();
  aplicarBusqueda();
}


// ─── CREAR CARD ───

/**
 * Crea el elemento DOM que representa una tarea, con sus estilos,
 * badges y manejadores de eventos (toggle de completada y eliminación).
 *
 * @param {{id:number, titulo:string, categoria:string, prioridad:string, estado:string}} tarea
 * Objeto de tarea que se va a renderizar.
 * @returns {HTMLDivElement} Card de tarea lista para insertarse en el DOM.
 */
function crearCard(tarea) {
  const div = document.createElement('div');

  div.className = `task-card
    flex items-center gap-4 px-6 py-4
    bg-white dark:bg-tf-surface
    border border-gray-200 dark:border-tf-border
    rounded-2xl cursor-pointer
    transition-colors duration-320`;

  div.dataset.id = tarea.id;
  if (tarea.estado === 'completada') div.classList.add('done');

  div.innerHTML = `
    <div class="task-card__check
                w-5 h-5 rounded-full shrink-0
                border-2 border-gray-300 dark:border-tf-border
                flex items-center justify-center text-[0.7rem]
                transition-all duration-320">
      ${tarea.estado === 'completada' ? '✓' : ''}
    </div>
    <div class="task-card__body flex-1 flex flex-col gap-1 min-w-0">
      <div class="task-card__top flex items-center gap-2">
        <span class="task-card__title font-display text-sm font-semibold
                     text-gray-900 dark:text-tf-text truncate transition-colors duration-320">
          ${tarea.titulo}
        </span>
      </div>
      <div class="task-card__bottom flex items-center gap-2">
        <span class="badge-category">${tarea.categoria}</span>
        <span class="badge-priority ${tarea.prioridad}">${capitalizar(tarea.prioridad)}</span>
      </div>
    </div>
    <button class="btn-delete opacity-0 shrink-0 bg-transparent border-none
                   text-gray-400 dark:text-tf-muted text-xl leading-none
                   cursor-pointer px-2 py-0.5 rounded-lg transition-all duration-320
                   hover:text-tf-danger hover:bg-tf-danger/10"
            title="Eliminar tarea">×</button>
  `;

  div.addEventListener('click', function(e) {
    if (e.target.closest('.btn-delete')) return;
    const t = tasks.find(t => t.id === tarea.id);
    t.estado = (t.estado === 'completada') ? 'pendiente' : 'completada';
    guardarTareas();
    renderizarTodo();
  });

  div.querySelector('.btn-delete').addEventListener('click', function(e) {
    e.stopPropagation();
    tasks = tasks.filter(t => t.id !== tarea.id);
    guardarTareas();
    div.remove();
    actualizarContadores();
  });

  return div;
}


// ─── MODAL ───

let estadoParaNuevaTarea = 'pendiente';

document.querySelectorAll('.section__add').forEach(function(btn) {
  btn.addEventListener('click', function() {
    estadoParaNuevaTarea = btn.dataset.estado;
    abrirModal();
  });
});

/**
 * Abre el modal para añadir una nueva tarea, dejando el título vacío
 * y enfocando el campo de texto.
 */
function abrirModal() {
  modal.classList.remove('hidden');
  modalTitulo.value = '';
  modalTitulo.focus();
}

/**
 * Cierra el modal de creación de tarea.
 */
function cerrarModal() {
  modal.classList.add('hidden');
}

modalCancel.addEventListener('click', cerrarModal);

modal.addEventListener('click', function(e) {
  if (e.target === modal) cerrarModal();
});

modalSave.addEventListener('click', function() {
  const titulo = modalTitulo.value.trim();
  if (!titulo) {
    modalTitulo.classList.add('border-tf-danger', 'ring-2', 'ring-tf-danger/20');
    setTimeout(() => {
      modalTitulo.classList.remove('border-tf-danger', 'ring-2', 'ring-tf-danger/20');
    }, 1000);
    return;
  }

  const nuevaTarea = {
    id:        Date.now(),
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

modalTitulo.addEventListener('keydown', function(e) {
  if (e.key === 'Enter')  modalSave.click();
  if (e.key === 'Escape') cerrarModal();
});


// ─── BUSCADOR ───

searchInput.addEventListener('input', aplicarBusqueda);

/**
 * Aplica el filtro de búsqueda actual sobre las tarjetas de tareas,
 * ocultando aquellas cuyo título no contiene el texto introducido.
 */
function aplicarBusqueda() {
  const query = searchInput.value.toLowerCase().trim();
  document.querySelectorAll('.task-card').forEach(function(card) {
    const titulo = card.querySelector('.task-card__title').textContent.toLowerCase();
    card.classList.toggle('hidden', query !== '' && !titulo.includes(query));
  });
}


// ─── CONTADORES ───

/**
 * Recalcula los totales de tareas (por estado, prioridad y categoría)
 * y actualiza los elementos del DOM que muestran esos contadores y el
 * porcentaje completado.
 */
function actualizarContadores() {
  const total = tasks.length;

  let completadas = 0;
  let progreso    = 0;
  let pendiente   = 0;
  let alta        = 0;

  const categorias = {
    Desarrollo: 0,
    Deporte: 0,
    Gestión: 0,
    Investigación: 0,
  };

  tasks.forEach(function(t) {
    if (t.estado === 'completada') completadas++;
    if (t.estado === 'progreso')   progreso++;
    if (t.estado === 'pendiente')  pendiente++;
    if (t.prioridad === 'alta')    alta++;

    Object.keys(categorias).forEach(function(cat) {
      if (t.categoria.includes(cat)) categorias[cat]++;
    });
  });

  setText('count-todas',      total);
  setText('count-progreso',   progreso);
  setText('count-completada', completadas);
  setText('count-alta',       alta);

  Object.keys(categorias).forEach(function(cat) {
    setText('count-' + cat, categorias[cat]);
  });

  setText('label-progreso',   progreso    + (progreso    === 1 ? ' tarea' : ' tareas'));
  setText('label-pendiente',  pendiente   + (pendiente   === 1 ? ' tarea' : ' tareas'));
  setText('label-completada', completadas + (completadas === 1 ? ' tarea' : ' tareas'));
  setText('stat-completadas', completadas + ' / ' + total);
  setText('stat-alta',        alta);
  setText('header-meta',      pendiente   + ' pendiente' + (pendiente !== 1 ? 's' : ''));

  const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;
  const fill = document.getElementById('progress-fill');
  if (fill) fill.style.width = porcentaje + '%';
}

/**
 * Actualiza el `textContent` de un elemento por su `id`, si existe
 * en el documento.
 *
 * @param {string} id - Identificador del elemento en el DOM.
 * @param {string|number} valor - Texto o número a mostrar.
 */
function setText(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor;
}

/**
 * Devuelve la misma cadena con la primera letra en mayúscula.
 *
 * @param {string} str - Texto a capitalizar.
 * @returns {string} Cadena con la primera letra en mayúscula.
 */
function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


// ─── ARRANQUE ───

renderizarTodo();