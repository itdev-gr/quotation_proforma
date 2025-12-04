import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Service {
  id: string;
  name: string;
  price: number;
  vat: number;
  discount: number;
}

interface CompanyInfo {
  name?: string;
  vatNumber?: string;
  taxOffice?: string;
}

interface ClientInfo {
  name?: string;
  vatNumber?: string;
  taxOffice?: string;
  address?: string;
}

function formatGreekNumber(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

export async function exportToPDF(
  services: Service[],
  subtotal: number,
  totalDiscount: number,
  vatAmount: number,
  total: number,
  companyInfo?: CompanyInfo,
  clientInfo?: ClientInfo,
  quotationNumber?: string,
  date?: string,
  documentType?: string
) {
  try {
    console.log('Starting PDF generation with html2canvas + jsPDF...', { services, subtotal, totalDiscount, vatAmount, total });

    if (!services || services.length === 0) {
      alert('Please add at least one service before exporting.');
      return;
    }

    // Default company info
    const company = {
      name: companyInfo?.name || 'IT DEV',
      vatNumber: companyInfo?.vatNumber || '802223278',
      taxOffice: companyInfo?.taxOffice || 'ΙΖ ΑΘΗΝΩΝ',
    };

    // Default client info
    const client = {
      name: clientInfo?.name || '',
      vatNumber: clientInfo?.vatNumber || '',
      taxOffice: clientInfo?.taxOffice || '',
      address: clientInfo?.address || '',
    };

    // Load logo image as data URL (try different formats)
    let logoDataUrl = '';
    const logoFormats = ['/logo.png', '/logo.jpg', '/logo.jpeg', '/logo.svg'];
    
    for (const logoPath of logoFormats) {
      try {
        const logoResponse = await fetch(logoPath);
        if (logoResponse.ok) {
          const logoBlob = await logoResponse.blob();
          logoDataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(logoBlob);
          });
          console.log('Logo loaded successfully from:', logoPath);
          break;
        }
      } catch (error) {
        // Try next format
        continue;
      }
    }
    
    // If no logo file found, log a warning
    if (!logoDataUrl) {
      console.warn('Logo image not found. Please ensure logo.svg, logo.png, logo.jpg, or logo.jpeg exists in the public folder.');
    }

    // Create a temporary container for the PDF content
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '210mm'; // A4 width
    container.style.padding = '20mm';
    container.style.backgroundColor = 'white';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '9pt';
    container.style.color = 'black';
    document.body.appendChild(container);

    // Build the HTML content
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 20px;">
        <!-- Logo -->
        ${logoDataUrl ? `<img src="${logoDataUrl}" alt="Company Logo" style="width: 108px; height: 108px; margin-bottom: 10px; object-fit: contain;" />` : ''}
        
        <!-- Company Info -->
        <div style="text-align: center;">
          <div style="font-size: 16pt; font-weight: bold; margin-bottom: 5px;">${company.name.toUpperCase()}</div>
          <div style="font-size: 9pt;">Α.Φ.Μ.: ${company.vatNumber} Δ.Ο.Υ.: ${company.taxOffice}</div>
        </div>
      </div>

      <!-- Client and Document Info Boxes -->
      <div style="display: flex; gap: 20px; margin-bottom: 15px;">
        <!-- Client Box -->
        <div style="width: 48%; border: 0.5px solid black; padding: 8px; min-height: 50px;">
          <div style="font-weight: bold; margin-bottom: 4px;">ΕΠΩΝΥΜΙΑ:</div>
          <div style="margin-left: 30px; margin-bottom: 8px;">${client.name || '_________________'}</div>
          <div style="font-weight: bold; margin-bottom: 4px;">Α.Φ.Μ.:</div>
          <div style="margin-left: 30px; margin-bottom: 8px;">${client.vatNumber || '_________________'}</div>
          <div style="font-weight: bold; margin-bottom: 4px;">Δ.Ο.Υ.:</div>
          <div style="margin-left: 30px; margin-bottom: 8px;">${client.taxOffice || '_________________'}</div>
          <div style="font-weight: bold; margin-bottom: 4px;">ΔΙΕΥΘΥΝΣΗ:</div>
          <div style="margin-left: 30px;">${client.address || '_________________'}</div>
        </div>

        <!-- Document Details Box -->
        <div style="width: 48%; border: 0.5px solid black; padding: 8px; min-height: 50px;">
          <div style="font-size: 10pt; font-weight: bold; text-align: center; margin-bottom: 10px;">${documentType === 'Pro forma invoice' ? 'Προτιμολόγιο' : 'Προσφορά Παροχής Υπηρεσιών'}</div>
          <div style="font-weight: bold; margin-bottom: 4px;">ΣΕΙΡΑ:</div>
          <div style="margin-left: 30px; margin-bottom: 8px;">ΤΠΥ</div>
          <div style="font-weight: bold; margin-bottom: 4px;">ΑΡΙΘΜΟΣ:</div>
          <div style="margin-left: 30px; margin-bottom: 8px;">${quotationNumber || '_________________'}</div>
          <div style="font-weight: bold; margin-bottom: 4px;">ΗΜΕΡΟΜΗΝΙΑ:</div>
          <div style="margin-left: 30px;">${date || new Date().toLocaleDateString('el-GR')}</div>
        </div>
      </div>

      <!-- Table -->
      <div style="margin-top: 15px; margin-bottom: 10px;">
        <div style="display: flex; border-bottom: 0.5px solid black; padding-bottom: 5px; margin-bottom: 8px;">
          <div style="width: 5%; font-size: 10pt; font-weight: bold;">A/A</div>
          <div style="width: 70%; font-size: 10pt; font-weight: bold;">ΠΕΡΙΓΡΑΦΗ - ΑΝΑΛΥΣΗ ΥΠΗΡΕΣΙΑΣ</div>
          <div style="width: 25%; font-size: 10pt; font-weight: bold; text-align: right;">ΑΞΙΑ</div>
        </div>

        ${services.map((service, index) => {
          const priceAfterDiscount = service.price - (service.price * service.discount) / 100;
          const totalPerService = priceAfterDiscount + (priceAfterDiscount * service.vat) / 100;
          return `
            <div style="display: flex; margin-bottom: 8px;">
              <div style="width: 5%;">${index + 1}</div>
              <div style="width: 70%;">
                ${service.name}
                ${service.discount > 0 ? `<div style="font-size: 8pt; color: #666; margin-top: 2px;">(Εκπτώση: ${service.discount}%)</div>` : ''}
              </div>
              <div style="width: 25%; text-align: right;">€${formatGreekNumber(totalPerService)}</div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Summary and Comments -->
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <div style="margin-top: 10px;">
          <div style="font-weight: bold; margin-bottom: 5px;">ΣΧΟΛΙΑ:</div>
        </div>

        <div style="width: 48%; border: 0.5px solid black; padding: 8px; margin-top: 10px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-weight: bold;">ΚΑΘΑΡΗ ΑΞΙΑ:</span>
            <span>€${formatGreekNumber(subtotal)}</span>
          </div>
          ${totalDiscount > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-weight: bold;">ΣΥΝΟΛΙΚΗ ΕΚΠΤΩΣΗ:</span>
            <span>-€${formatGreekNumber(totalDiscount)}</span>
          </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-weight: bold;">Φ.Π.Α.:</span>
            <span>€${formatGreekNumber(vatAmount)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 5px;">
            <span style="font-size: 11pt; font-weight: bold;">ΤΕΛΙΚΗ ΑΞΙΑ:</span>
            <span style="font-size: 11pt; font-weight: bold;">€${formatGreekNumber(total)}</span>
          </div>
        </div>
      </div>

      <!-- Signature -->
      <div style="margin-top: 30px; text-align: center;">
        <div style="font-weight: bold; margin-bottom: 5px;">Ο ΕΚΔΟΤΗΣ</div>
        <div style="border-top: 0.5px solid black; width: 80px; margin: 10px auto 0;"></div>
      </div>
    `;

    // Wait for logo image to load (if using data URL, it should load immediately)
    const logoImg = container.querySelector('img');
    if (logoImg) {
      await new Promise((resolve) => {
        if (logoImg.complete) {
          resolve(undefined);
        } else {
          logoImg.onload = () => resolve(undefined);
          logoImg.onerror = () => {
            console.warn('Logo image failed to load, continuing without it');
            resolve(undefined);
          };
          // Timeout after 2 seconds
          setTimeout(() => resolve(undefined), 2000);
        }
      });
    }

    // Wait a bit for rendering
    await new Promise(resolve => setTimeout(resolve, 200));

    // Convert to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Remove temporary container
    document.body.removeChild(container);

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save PDF
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = documentType === 'Pro forma invoice' 
      ? `proforma-invoice-${dateStr}.pdf`
      : `quotation-${dateStr}.pdf`;
    pdf.save(fileName);

    console.log('PDF export completed successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert(`Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

