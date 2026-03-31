/**
 * Caticha.uy - Google Apps Script Backend
 * 
 * Instructions:
 * 1. Create a Google Sheet.
 * 2. In the menu, go to Extensions > Apps Script.
 * 3. Replace the content of Code.gs with this code.
 * 4. Create a sheet named "Requests" (if not existing).
 * 5. Add headers in Row 1: ID, Date, Name, WhatsApp, Zone, Service, Description, Status.
 * 6. Click "Deploy" > "New Deployment".
 * 7. Select "Web App".
 * 8. Set "Execute as" to "Me".
 * 9. Set "Who has access" to "Anyone".
 * 10. Copy the Web App URL and paste it into your React app.
 */

const SHEET_NAME = 'Requests';

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const json = rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header.toLowerCase()] = row[index];
      });
      return obj;
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: json
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    // Auto-generate ID (milliseconds since epoch)
    const id = new Date().getTime();
    const date = new Date().toLocaleString();
    const status = 'Pending';
    
    sheet.appendRow([
      id,
      date,
      contents.name,
      contents.whatsapp,
      contents.zone,
      contents.service,
      contents.description,
      status
    ]);

    // Send email notification to technician
    const technicianEmail = 'aparra.qa@gmail.com';
    const emailSubject = `🔔 Nueva Solicitud: ${contents.service} en ${contents.zone}`;
    const emailBody = `
      Hola, se ha registrado una nueva solicitud de servicio:
      
      - Cliente: ${contents.name}
      - WhatsApp: ${contents.whatsapp}
      - Zona: ${contents.zone}
      - Servicio: ${contents.service}
      - Descripción: ${contents.description}
      
      Fecha y hora: ${date}
      
      Puedes gestionarlo desde el panel de control: 
      https://caticha-aires.vercel.app/admin
    `;

    try {
      MailApp.sendEmail(technicianEmail, emailSubject, emailBody);
    } catch (mailError) {
      console.error('Error sending email:', mailError);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      id: id
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to handle CORS and other methods if needed
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .addHeader('Access-Control-Allow-Origin', '*')
    .addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .addHeader('Access-Control-Allow-Headers', 'Content-Type');
}
