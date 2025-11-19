// src/services/pdf/reciboGenerator.js

/**
 * Genera un recibo en PDF
 * @param {Object} recibo - Objeto del recibo con toda la información
 */
export const generarReciboPDF = (recibo) => {
  // Crear ventana nueva para imprimir
  const ventanaImpresion = window.open('', '', 'height=600,width=800');
  
  if (!ventanaImpresion) {
    alert('Por favor, habilite las ventanas emergentes para generar el recibo');
    return;
  }

  const { socio } = recibo;
  
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recibo ${recibo.numero_recibo}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          padding: 20px;
          background: white;
        }
        
        .recibo-container {
          max-width: 800px;
          margin: 0 auto;
          border: 2px solid #2563eb;
          border-radius: 10px;
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 32px;
          margin-bottom: 10px;
          font-weight: bold;
        }
        
        .header p {
          font-size: 16px;
          opacity: 0.95;
        }
        
        .numero-recibo {
          background: white;
          color: #2563eb;
          padding: 15px 30px;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .contenido {
          padding: 40px;
        }
        
        .info-section {
          margin-bottom: 30px;
        }
        
        .info-row {
          display: flex;
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .info-label {
          font-weight: bold;
          color: #374151;
          width: 180px;
          flex-shrink: 0;
        }
        
        .info-value {
          color: #1f2937;
          flex: 1;
        }
        
        .monto-total {
          background: #f0f9ff;
          border: 2px solid #2563eb;
          border-radius: 8px;
          padding: 25px;
          text-align: center;
          margin: 30px 0;
        }
        
        .monto-total .label {
          font-size: 16px;
          color: #374151;
          margin-bottom: 10px;
        }
        
        .monto-total .valor {
          font-size: 42px;
          font-weight: bold;
          color: #2563eb;
        }
        
        .footer {
          background: #f9fafb;
          padding: 30px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
        }
        
        .firma-section {
          margin-top: 60px;
          display: flex;
          justify-content: space-around;
        }
        
        .firma {
          text-align: center;
        }
        
        .firma-linea {
          width: 200px;
          border-top: 2px solid #374151;
          margin: 0 auto 10px;
        }
        
        .firma-texto {
          font-size: 14px;
          color: #6b7280;
        }
        
        .nota {
          margin-top: 20px;
          font-size: 12px;
          color: #6b7280;
          font-style: italic;
        }
        
        .estado-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }
        
        .estado-emitido {
          background: #d1fae5;
          color: #065f46;
        }
        
        .estado-anulado {
          background: #fee2e2;
          color: #991b1b;
        }
        
        @media print {
          body {
            padding: 0;
          }
          
          .recibo-container {
            border: none;
            box-shadow: none;
          }
          
          @page {
            margin: 1cm;
          }
        }
      </style>
    </head>
    <body>
      <div class="recibo-container">
        <!-- Header -->
        <div class="header">
          <h1>RECIBO DE PAGO</h1>
          <p>Asociación de Propietarios</p>
        </div>
        
        <!-- Número de Recibo -->
        <div class="numero-recibo">
          RECIBO N° ${recibo.numero_recibo}
          <span class="estado-badge ${recibo.estado === 'emitido' ? 'estado-emitido' : 'estado-anulado'}">
            ${recibo.estado === 'emitido' ? 'EMITIDO' : 'ANULADO'}
          </span>
        </div>
        
        <!-- Contenido -->
        <div class="contenido">
          <!-- Información del Socio -->
          <div class="info-section">
            <h3 style="color: #2563eb; margin-bottom: 15px; font-size: 18px;">
              📋 DATOS DEL SOCIO
            </h3>
            
            <div class="info-row">
              <div class="info-label">Nombre:</div>
              <div class="info-value">${socio.nombre}</div>
            </div>
            
            <div class="info-row">
              <div class="info-label">DNI:</div>
              <div class="info-value">${socio.dni}</div>
            </div>
            
            <div class="info-row">
              <div class="info-label">Lote:</div>
              <div class="info-value">${socio.lote}</div>
            </div>
            
            <div class="info-row">
              <div class="info-label">Teléfono:</div>
              <div class="info-value">${socio.telefono || 'No registrado'}</div>
            </div>
          </div>
          
          <!-- Información del Pago -->
          <div class="info-section">
            <h3 style="color: #2563eb; margin-bottom: 15px; font-size: 18px;">
              💰 DETALLE DEL PAGO
            </h3>
            
            <div class="info-row">
              <div class="info-label">Fecha de Emisión:</div>
              <div class="info-value">${formatearFecha(recibo.fecha_emision)}</div>
            </div>
            
            <div class="info-row">
              <div class="info-label">Concepto:</div>
              <div class="info-value">${recibo.concepto}</div>
            </div>
            
            <div class="info-row">
              <div class="info-label">Método de Pago:</div>
              <div class="info-value">${formatearMetodoPago(recibo.metodo_pago)}</div>
            </div>
          </div>
          
          <!-- Monto Total -->
          <div class="monto-total">
            <div class="label">MONTO TOTAL</div>
            <div class="valor">S/ ${parseFloat(recibo.monto).toFixed(2)}</div>
          </div>
          
          <!-- Firmas -->
          <div class="firma-section">
            <div class="firma">
              <div class="firma-linea"></div>
              <div class="firma-texto">Firma del Tesorero</div>
            </div>
            <div class="firma">
              <div class="firma-linea"></div>
              <div class="firma-texto">Firma del Socio</div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p style="font-weight: bold; margin-bottom: 10px;">
            ¡Gracias por su puntualidad en los pagos!
          </p>
          <p class="nota">
            Este recibo es válido como comprobante de pago. 
            Conservar para futuras referencias.
          </p>
          <p class="nota" style="margin-top: 10px;">
            Generado el ${formatearFechaCompleta(new Date())}
          </p>
        </div>
      </div>
      
      <script>
        // Imprimir automáticamente al cargar
        window.onload = function() {
          window.print();
        }
        
        // Cerrar ventana después de imprimir o cancelar
        window.onafterprint = function() {
          window.close();
        }
      </script>
    </body>
    </html>
  `;

  ventanaImpresion.document.write(html);
  ventanaImpresion.document.close();
};

/**
 * Formatea una fecha en formato dd/mm/yyyy
 */
const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A';
  const date = new Date(fecha);
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const anio = date.getFullYear();
  return `${dia}/${mes}/${anio}`;
};

/**
 * Formatea una fecha completa con hora
 */
const formatearFechaCompleta = (fecha) => {
  const opciones = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return fecha.toLocaleDateString('es-PE', opciones);
};

/**
 * Formatea el método de pago
 */
const formatearMetodoPago = (metodo) => {
  const metodos = {
    'efectivo': 'Efectivo',
    'transferencia': 'Transferencia Bancaria',
    'yape': 'Yape',
    'plin': 'Plin',
    'deposito': 'Depósito Bancario'
  };
  return metodos[metodo] || metodo || 'No especificado';
};

export default {
  generarReciboPDF
};