/*
  Backend Robusto para Caticha Air-Control
*/

const SHEET_NAME = 'Requests';

// 1. TRUCO DEFINITIVO: Esto crea un menú en tu Google Sheet
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('⚙️ Configuración Caticha')
      .addItem('✅ 1. Autorizar Envío de Correos (Clic Aquí)', 'forzarPermisosGmail')
      .addToUi();
}

function forzarPermisosGmail() {
  const tecnico = 'aparra.qa@gmail.com';
  try {
    GmailApp.sendEmail(tecnico, "Prueba Definitiva - Caticha", "Si lees esto, ¡lo logramos! Los permisos de Gmail están activos.");
    SpreadsheetApp.getUi().alert("¡Éxito! Revisa tu correo " + tecnico + ". Los permisos están otorgados.");
  } catch (error) {
    SpreadsheetApp.getUi().alert("Error al enviar: " + error.toString());
  }
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['ID', 'Date', 'Name', 'WhatsApp', 'Zone', 'Service', 'Description', 'Status']);
    const headerRange = sheet.getRange(1, 1, 1, 8);
    headerRange.setFontWeight('bold').setBackground('#0f172a').setFontColor('#ffffff').setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, 8);
  }
  return sheet;
}

function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const json = rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        const key = header.toString().toLowerCase();
        obj[key] = row[index];
      });
      return obj;
    });
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: json }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    
    // --- NUEVO: Lógica para actualizar el estado ---
    if (contents.action === 'updateStatus') {
      const data = sheet.getDataRange().getValues();
      let rowIndex = -1;
      
      // Buscar la fila por ID (columna 0)
      for (let i = 1; i < data.length; i++) {
        // Asegurarse de convertir ambos a string para compararlos
        if (data[i][0].toString() === contents.id.toString()) {
          rowIndex = i + 1; // +1 porque getRange es 1-indexed y saltamos la fila 0 de headers
          break;
        }
      }
      
      if (rowIndex !== -1) {
        // La columna de Status es la 8 (H)
        sheet.getRange(rowIndex, 8).setValue(contents.status);
        return ContentService.createTextOutput(JSON.stringify({ status: 'success', id: contents.id }))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'ID no encontrado' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    // ---------------------------------------------
    
    // --- Lógica original para CREAR un pedido ---
    const id = new Date().getTime();
    const date = new Date().toLocaleString('es-UY', { timeZone: 'America/Montevideo' });
    const status = 'Pendiente';
    
    sheet.appendRow([
      id, date, contents.name, contents.whatsapp, contents.zone, contents.service, contents.description, status
    ]);

    // Notificación por Mail Automática al Técnico
    const technicianEmail = 'aparra.qa@gmail.com';
    const emailSubject = `🔔 NUEVO PEDIDO: ${contents.service} en ${contents.zone}`;
    const emailBody = `
      NUEVA SOLICITUD DE SERVICIO REGISTRADA:
      
      - Cliente: ${contents.name}
      - WhatsApp: ${contents.whatsapp}
      - Zona: ${contents.zone}
      - Servicio: ${contents.service}
      - Detalle: ${contents.description}
      
      Registrado el: ${date}
      Gestionar en: https://caticha-aires.vercel.app/admin
    `;

    try {
      GmailApp.sendEmail(technicianEmail, emailSubject, emailBody);
    } catch (mailError) { console.error('Error enviando mail:', mailError); }
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', id: id }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.TEXT)
    .addHeader('Access-Control-Allow-Origin', '*')
    .addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .addHeader('Access-Control-Allow-Headers', 'Content-Type');
}
