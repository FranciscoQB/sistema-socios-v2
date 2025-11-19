// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Dividir el código en chunks más pequeños
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar React y React-DOM
          'react-vendor': ['react', 'react-dom'],
          
          // Separar Supabase
          'supabase-vendor': ['@supabase/supabase-js'],
          
          // Separar Lucide Icons
          'icons-vendor': ['lucide-react'],
          
          // Separar las vistas en grupos
          'views-main': [
            './src/views/dashboard/DashboardView',
            './src/views/socios/SociosView',
            './src/views/aportes/AportesView'
          ],
          'views-secondary': [
            './src/views/asistencia/AsistenciaView',
            './src/views/proyectos/ProyectosView',
            './src/views/libro-caja/LibroCajaView'
          ],
          'views-reports': [
            './src/views/recibos/RecibosView',
            './src/views/documentos/DocumentosView',
            './src/views/reportes/ReportesView',
            './src/views/configuracion/ConfiguracionView'
          ]
        }
      }
    },
    // Aumentar el límite de advertencia a 1000 kB
    chunkSizeWarningLimit: 1000
  }
})