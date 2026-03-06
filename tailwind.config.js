//  tailwind.config.js
//  Configuración de Tailwind para TaskFlow

/** @type {import('tailwindcss').Config} */
module.exports = {

  // darkMode: 'class' → el modo oscuro se activa añadiendo la clase
  // 'dark' al elemento <html>. Así controlamos el tema desde JS.
  darkMode: 'class',

  // content → Tailwind escanea estos archivos para saber qué clases
  // están en uso y eliminar las que no se usan en producción (purge).
  content: ['./*.html', './*.js'],

  theme: {
    extend: {

      // Extendemos la paleta de colores con los colores exactos
      // del diseño original de TaskFlow
      colors: {
        'tf-bg':       '#0d0f14',
        'tf-surface':  '#161920',
        'tf-surface2': '#1e2230',
        'tf-border':   '#272c3a',
        'tf-accent':   '#5b8def',
        'tf-text':     '#e8eaf0',
        'tf-muted':    '#6b7280',
        'tf-danger':   '#f87171',
        'tf-warning':  '#fbbf24',
        'tf-success':  '#34d399',
        'tf-done':     '#a3e635',
      },

      // Fuentes del proyecto
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },

      // Duración de transición personalizada
      transitionDuration: {
        '320': '320ms',
      },

    }
  },

  plugins: []
}
