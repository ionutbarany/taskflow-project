//  TASKFLOW — src/app.js

import * as api from './api/client.js';


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
  renderizarGrafico();
});

actualizarIconoTema();


// ─── SIDEBAR TOGGLE ──────────────────────────────────────────

const sidebar       = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');

sidebarToggle.title = sidebar.classList.contains('collapsed')
  ? 'Mostrar panel lateral'
  : 'Ocultar panel lateral';

sidebarToggle.addEventListener('click', function() {
  const isCollapsed = sidebar.classList.toggle('collapsed');
  sidebarToggle.title = isCollapsed ? 'Mostrar panel lateral' : 'Ocultar panel lateral';
  localStorage.setItem('tf-sidebar-collapsed', isCollapsed);
});


// ─── REFERENCIAS AL DOM ───

const listProgreso   = document.getElementById('list-progreso');
const listPendiente  = document.getElementById('list-pendiente');
const listCompletada = document.getElementById('list-completada');

const modal          = document.getElementById('modal');
const modalTitulo    = document.getElementById('modal-titulo');
const modalCategoria = document.getElementById('modal-categoria');
const modalPrioridad = document.getElementById('modal-prioridad');
const modalFecha     = document.getElementById('modal-fecha');
const modalCancel    = document.getElementById('modal-cancel');
const modalSave      = document.getElementById('modal-save');
const modalHeading   = document.getElementById('modal-heading');

const searchInput    = document.getElementById('search-input');


// ─── ESTADO Y RED (API) ───

let tasks = [];

const historicoCompletadas = {};

function obtenerHistorico() {
  return historicoCompletadas;
}

function registrarCompletadaHoy() {
  const hoy = new Date().toISOString().split('T')[0];
  historicoCompletadas[hoy] = (historicoCompletadas[hoy] || 0) + 1;
}

let pendingNetworkOps = 0;

function beginLoading() {
  pendingNetworkOps++;
  updateLoadingUi();
}

function endLoading() {
  pendingNetworkOps = Math.max(0, pendingNetworkOps - 1);
  updateLoadingUi();
}

function updateLoadingUi() {
  const el = document.getElementById('network-loading');
  if (el) el.classList.toggle('hidden', pendingNetworkOps === 0);
}

function showApiError(message) {
  const wrap = document.getElementById('network-error');
  const msg = document.getElementById('network-error-message');
  if (msg) msg.textContent = message;
  if (wrap) wrap.classList.remove('hidden');
}

function clearApiError() {
  const wrap = document.getElementById('network-error');
  if (wrap) wrap.classList.add('hidden');
}

async function cargarTareasInicial() {
  beginLoading();
  clearApiError();
  try {
    tasks = await api.fetchTasks();
    renderizarTodo();
  } catch (e) {
    const mensaje =
      e instanceof TypeError
        ? 'No se pudo conectar con el servidor. Comprueba que la API esté en marcha.'
        : e.message || 'No se pudieron cargar las tareas';
    showApiError(mensaje);
    tasks = [];
    renderizarTodo();
  } finally {
    endLoading();
  }
}

let chartInstancia = null;

function renderizarGrafico() {
  const historico = obtenerHistorico();
  const dias = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const labels = [];
  const datos  = [];

  const esModoOscuro = html.classList.contains('dark');
  const tooltipBg     = esModoOscuro ? '#161920' : '#ffffff';
  const tooltipBorder = esModoOscuro ? '#272c3a' : '#e5e7eb';
  const tooltipTitle  = esModoOscuro ? '#e8eaf0' : '#111827';
  const tooltipBody   = '#6b7280';
  const gridColor     = esModoOscuro ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)';

  for (let i = 6; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);
    const clave = fecha.toISOString().split('T')[0];
    labels.push(dias[fecha.getDay()]);
    datos.push(historico[clave] || 0);
  }

  const ctx = document.getElementById('chart-productividad');
  if (!ctx) return;

  if (chartInstancia) chartInstancia.destroy();

  chartInstancia = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: datos,
        backgroundColor: 'rgba(91,141,239,0.35)',
        borderColor: '#5b8def',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(91,141,239,0.75)'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed.y} tarea${ctx.parsed.y !== 1 ? 's' : ''}`
          },
          backgroundColor: tooltipBg,
          borderColor: tooltipBorder,
          borderWidth: 1,
          titleColor: tooltipTitle,
          bodyColor: tooltipBody,
          padding: 10,
          cornerRadius: 8
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#6b7280',
            font: { family: 'Syne', size: 11 }
          },
          grid: { display: false },
          border: { display: false }
        },
        y: {
          ticks: {
            color: '#6b7280',
            stepSize: 1,
            font: { size: 10 }
          },
          grid: { color: gridColor },
          border: { display: false },
          beginAtZero: true
        }
      }
    }
  });
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
  aplicarFiltroVista();
  renderizarGrafico();
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

  const hoy = new Date().toISOString().split('T')[0];
  const badgeFecha = tarea.fechaLimite ? `
  <span class="badge-fecha ${tarea.fechaLimite === hoy ? 'vence-hoy' : tarea.fechaLimite < hoy ? 'vencida' : ''}">
    ${tarea.fechaLimite === hoy ? '⚠️ Vence hoy' : tarea.fechaLimite < hoy ? '🔴 Vencida' : '📅 ' + formatearFecha(tarea.fechaLimite)}
  </span>` : '';

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
        <span class="badge-category">${tarea.categoria || '📋 Gestión'}</span>
        ${badgeFecha}
        <span class="badge-priority ${tarea.prioridad || 'media'}">${capitalizar(tarea.prioridad || 'media')}</span>
      </div>
    </div>
    <button class="btn-edit opacity-0 shrink-0 bg-transparent border-none
                   text-gray-400 dark:text-tf-muted text-base leading-none
                   cursor-pointer px-2 py-0.5 rounded-lg transition-all duration-320
                   hover:text-tf-accent hover:bg-tf-accent/10"
            title="Editar tarea">✎</button>
    <button class="btn-delete opacity-0 shrink-0 bg-transparent border-none
                   text-gray-400 dark:text-tf-muted text-base leading-none
                   cursor-pointer px-2 py-0.5 rounded-lg transition-all duration-320
                   hover:text-tf-danger hover:bg-tf-danger/10"
            title="Eliminar tarea">×</button>
  `;

  div.addEventListener('click', async function(e) {
    if (e.target.closest('.btn-delete') || e.target.closest('.btn-edit')) return;
    const t = tasks.find(x => x.id === tarea.id);
    if (!t) return;
    const nuevoEstado = t.estado === 'completada' ? 'pendiente' : 'completada';
    beginLoading();
    clearApiError();
    try {
      const actualizada = await api.updateTask(t.id, { estado: nuevoEstado });
      Object.assign(t, actualizada);
      if (actualizada.estado === 'completada') registrarCompletadaHoy();
      renderizarTodo();
    } catch (err) {
      showApiError(err.message);
    } finally {
      endLoading();
    }
  });

  div.querySelector('.btn-delete').addEventListener('click', async function(e) {
    e.stopPropagation();

    beginLoading();
    clearApiError();
    try {
      await api.deleteTask(tarea.id);
    } catch (err) {
      showApiError(err.message);
      endLoading();
      return;
    }
    endLoading();

    div.style.animation = 'none';

    gsap.to(div, {
      x: 120,
      opacity: 0,
      scale: 0.85,
      rotation: 3,
      duration: 0.4,
      ease: 'power3.in',
      onComplete: function() {
        div.style.overflow = 'hidden';
        gsap.to(div, {
          height: 0,
          paddingTop: 0,
          paddingBottom: 0,
          marginTop: 0,
          marginBottom: 0,
          borderWidth: 0,
          duration: 0.3,
          ease: 'power2.inOut',
          onComplete: function() {
            tasks = tasks.filter(t => t.id !== tarea.id);
            div.remove();
            actualizarContadores();
            renderizarGrafico();
          }
        });
      }
    });
  });

  div.querySelector('.btn-edit').addEventListener('click', function(e) {
    e.stopPropagation();
    const tareaEditar = tasks.find(t => t.id === tarea.id);
    abrirModal(tareaEditar);
  });

  return div;
}


// ─── MODAL ───

let estadoParaNuevaTarea = 'pendiente';
let tareaEditandoId = null;

document.querySelectorAll('.section__add').forEach(function(btn) {
  btn.addEventListener('click', function() {
    estadoParaNuevaTarea = btn.dataset.estado;
    abrirModal();
  });
});

/**
 * Abre el modal en modo creación o edición según se pase una tarea.
 */
function abrirModal(tareaEditar) {
  tareaEditandoId = tareaEditar ? tareaEditar.id : null;

  if (tareaEditar) {
    modalHeading.textContent     = 'Editar tarea';
    modalSave.textContent        = 'Editar tarea';
    modalTitulo.value            = tareaEditar.titulo;
    modalCategoria.value         = tareaEditar.categoria || modalCategoria.options[0].value;
    modalPrioridad.value         = tareaEditar.prioridad || 'media';
    modalFecha.value             = tareaEditar.fechaLimite || '';
  } else {
    modalHeading.textContent     = 'Nueva tarea';
    modalSave.textContent        = 'Añadir tarea';
    modalTitulo.value            = '';
    modalCategoria.value         = modalCategoria.options[0].value;
    modalPrioridad.value         = modalPrioridad.options[0].value;
    modalFecha.value             = '';
  }

  modal.classList.remove('hidden');
  modalTitulo.focus();
}

/**
 * Cierra el modal y resetea el modo edición.
 */
function cerrarModal() {
  modal.classList.add('hidden');
  tareaEditandoId = null;
}

modalCancel.addEventListener('click', cerrarModal);

modal.addEventListener('click', function(e) {
  if (e.target === modal) cerrarModal();
});

modalSave.addEventListener('click', async function() {
  const titulo = modalTitulo.value.trim();
  if (!titulo) {
    modalTitulo.classList.add('border-tf-danger', 'ring-2', 'ring-tf-danger/20');
    setTimeout(() => {
      modalTitulo.classList.remove('border-tf-danger', 'ring-2', 'ring-tf-danger/20');
    }, 1000);
    return;
  }

  beginLoading();
  clearApiError();
  try {
    if (tareaEditandoId !== null) {
      const actualizada = await api.updateTask(tareaEditandoId, {
        titulo,
        categoria: modalCategoria.value,
        prioridad: modalPrioridad.value,
        fechaLimite: modalFecha.value || null,
      });
      const idx = tasks.findIndex(t => t.id === tareaEditandoId);
      if (idx !== -1) Object.assign(tasks[idx], actualizada);
    } else {
      const creada = await api.createTask({
        titulo,
        estado: estadoParaNuevaTarea,
        categoria: modalCategoria.value,
        prioridad: modalPrioridad.value,
        fechaLimite: modalFecha.value || null,
      });
      tasks.push(creada);
    }
    cerrarModal();
    renderizarTodo();
  } catch (err) {
    showApiError(err.message);
  } finally {
    endLoading();
  }
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
  setText('count-pendiente',  pendiente);
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

function formatearFecha(fechaISO) {
  const [anyo, mes, dia] = fechaISO.split('-');
  return `${dia}/${mes}/${anyo}`;
}


// ─── FILTRO DE VISTAS ───

let filtroActivo = 'todas';

const sectionProgreso   = document.getElementById('section-progreso');
const sectionPendiente  = document.getElementById('section-pendiente');
const sectionCompletada = document.getElementById('section-completada');

const secciones = [sectionProgreso, sectionPendiente, sectionCompletada];

const mapaSeccionEstado = {
  'progreso':   sectionProgreso,
  'pendiente':  sectionPendiente,
  'completada': sectionCompletada
};

document.querySelectorAll('.nav-item').forEach(function(item) {
  item.addEventListener('click', function() {
    const filtro = item.dataset.filter;
    if (!filtro) return;

    document.querySelectorAll('.nav-item').forEach(function(n) {
      n.classList.remove('active');
    });
    item.classList.add('active');

    filtroActivo = filtro;
    aplicarFiltroVista();
  });
});

function aplicarFiltroVista() {
  const filtrosEstado = ['progreso', 'pendiente', 'completada'];
  const categorias = ['Desarrollo', 'Deporte', 'Gestión', 'Investigación'];

  if (filtroActivo === 'todas') {
    secciones.forEach(function(s) { s.style.display = ''; });
    document.querySelectorAll('.task-card').forEach(function(card) {
      card.classList.remove('hidden-by-filter');
      card.style.display = '';
    });
    aplicarBusqueda();
    return;
  }

  if (filtrosEstado.includes(filtroActivo)) {
    secciones.forEach(function(s) {
      const esVisible = mapaSeccionEstado[filtroActivo] === s;
      s.style.display = esVisible ? '' : 'none';
    });
    document.querySelectorAll('.task-card').forEach(function(card) {
      card.classList.remove('hidden-by-filter');
      card.style.display = '';
    });
    aplicarBusqueda();
    return;
  }

  if (filtroActivo === 'alta') {
    secciones.forEach(function(s) { s.style.display = ''; });

    document.querySelectorAll('.task-card').forEach(function(card) {
      const id = parseInt(card.dataset.id);
      const tarea = tasks.find(function(t) { return t.id === id; });
      const coincide = tarea && tarea.prioridad === 'alta';
      card.classList.toggle('hidden-by-filter', !coincide);
      card.style.display = coincide ? '' : 'none';
    });

    secciones.forEach(function(s) {
      const tarjetasVisibles = s.querySelectorAll('.task-card:not(.hidden-by-filter)');
      s.style.display = tarjetasVisibles.length > 0 ? '' : 'none';
    });

    aplicarBusqueda();
    return;
  }

  if (categorias.includes(filtroActivo)) {
    secciones.forEach(function(s) { s.style.display = ''; });

    document.querySelectorAll('.task-card').forEach(function(card) {
      const id = parseInt(card.dataset.id);
      const tarea = tasks.find(function(t) { return t.id === id; });
      const coincide = tarea && tarea.categoria.includes(filtroActivo);
      card.classList.toggle('hidden-by-filter', !coincide);
      card.style.display = coincide ? '' : 'none';
    });

    secciones.forEach(function(s) {
      const tarjetasVisibles = s.querySelectorAll('.task-card:not(.hidden-by-filter)');
      s.style.display = tarjetasVisibles.length > 0 ? '' : 'none';
    });

    aplicarBusqueda();
    return;
  }
}


// ─── ARRANQUE ───

const btnNetworkRetry = document.getElementById('network-retry');
if (btnNetworkRetry) {
  btnNetworkRetry.addEventListener('click', function() {
    clearApiError();
    cargarTareasInicial();
  });
}

cargarTareasInicial();

const opcionesSortable = {
  group: 'taskflow',
  animation: 150,
  ghostClass: 'sortable-ghost',
  chosenClass: 'sortable-chosen',
  dragClass: 'sortable-drag',
  onEnd: async function(evt) {
    const idArrastrada = parseInt(evt.item.dataset.id, 10);
    const columnaDestino = evt.to.id;

    const mapaEstado = {
      'list-progreso':   'progreso',
      'list-pendiente':  'pendiente',
      'list-completada': 'completada'
    };

    const nuevoEstado = mapaEstado[columnaDestino];
    const tarea = tasks.find(t => t.id === idArrastrada);
    if (!tarea) return;

    const idsProgreso   = [...listProgreso.querySelectorAll('.task-card')].map(c => parseInt(c.dataset.id, 10));
    const idsPendiente  = [...listPendiente.querySelectorAll('.task-card')].map(c => parseInt(c.dataset.id, 10));
    const idsCompletada = [...listCompletada.querySelectorAll('.task-card')].map(c => parseInt(c.dataset.id, 10));
    tasks = [
      ...idsProgreso.map(id => tasks.find(t => t.id === id)),
      ...idsPendiente.map(id => tasks.find(t => t.id === id)),
      ...idsCompletada.map(id => tasks.find(t => t.id === id))
    ].filter(Boolean);

    if (tarea.estado === nuevoEstado) {
      renderizarTodo();
      return;
    }

    beginLoading();
    clearApiError();
    try {
      const actualizada = await api.updateTask(idArrastrada, { estado: nuevoEstado });
      const t = tasks.find(x => x.id === idArrastrada);
      if (t) Object.assign(t, actualizada);
      if (nuevoEstado === 'completada') registrarCompletadaHoy();
      renderizarTodo();
    } catch (err) {
      showApiError(err.message);
      await cargarTareasInicial();
    } finally {
      endLoading();
    }
  }
};

Sortable.create(listProgreso,   opcionesSortable);
Sortable.create(listPendiente,  opcionesSortable);
Sortable.create(listCompletada, opcionesSortable);