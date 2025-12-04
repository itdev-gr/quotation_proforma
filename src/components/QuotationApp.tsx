import { useState, useEffect } from 'react';
import { exportToPDF } from '../utils/pdfExport';

interface Service {
  id: string;
  name: string;
  price: number;
  vat: number;
  discount: number;
}

export default function QuotationApp() {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceName, setServiceName] = useState('');
  const [websiteSubOption, setWebsiteSubOption] = useState('');
  const [localSEOSubOption, setLocalSEOSubOption] = useState('');
  const [webSEOSubOption, setWebSEOSubOption] = useState('');
  const [socialMediaSubOption, setSocialMediaSubOption] = useState('');
  const [advertisementPackage, setAdvertisementPackage] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productVat, setProductVat] = useState('24');
  const [productDiscount, setProductDiscount] = useState('0');

  // Auto-set price based on website, local SEO, web SEO, or social media sub-option
  useEffect(() => {
    if (serviceName === 'Website' && websiteSubOption) {
      const priceMap: { [key: string]: string } = {
        'Ξεκίνημα': '400',
        'Ανάπτυξη': '800',
        'E-shop': '1200',
      };
      setProductPrice(priceMap[websiteSubOption] || '');
    } else if (serviceName === 'Local SEO' && localSEOSubOption) {
      const priceMap: { [key: string]: string } = {
        'Τοπικό': '200',
        'Κοινότητα': '299',
        'Περιφέρεια': '349',
      };
      // Only auto-set price if it's one of the priced options
      if (priceMap[localSEOSubOption]) {
        setProductPrice(priceMap[localSEOSubOption] || '');
      }
    } else if (serviceName === 'Web SEO' && webSEOSubOption) {
      const priceMap: { [key: string]: string } = {
        'Βασικό': '300',
        'Ανάπτυξη': '399',
        'Εξουσία': '700',
        'Seo Audit': '100',
      };
      setProductPrice(priceMap[webSEOSubOption] || '');
    } else if (serviceName === 'Social Media' && socialMediaSubOption) {
      const priceMap: { [key: string]: string } = {
        'Starter Video Pack': '390',
        'Growth Video Pack': '690',
        'Performance Video Pack': '990',
        'Edit Only Pack': '290',
      };
      setProductPrice(priceMap[socialMediaSubOption] || '');
    }
  }, [websiteSubOption, localSEOSubOption, webSEOSubOption, socialMediaSubOption, serviceName]);

  // Client information
  const [clientName, setClientName] = useState('');
  const [clientVat, setClientVat] = useState('');
  const [clientTaxOffice, setClientTaxOffice] = useState('');
  const [clientAddress, setClientAddress] = useState('');

  // Company information
  const [companyName, setCompanyName] = useState('IT DEV');
  const [companyVat, setCompanyVat] = useState('802223278');
  const [companyTaxOffice, setCompanyTaxOffice] = useState('ΙΖ ΑΘΗΝΩΝ');

  // Document details
  const [documentType, setDocumentType] = useState('Quotation');
  const [quotationNumber, setQuotationNumber] = useState('');
  const [quotationDate, setQuotationDate] = useState(new Date().toLocaleDateString('el-GR'));

  const addService = () => {
    console.log('addService called', { serviceName, websiteSubOption, productPrice, productVat });
    
    // Validate inputs
    if (!serviceName || !serviceName.trim()) {
      console.warn('Service name is required');
      alert('Please select a service');
      return;
    }

    // If Website is selected, validate sub-option
    if (serviceName === 'Website' && (!websiteSubOption || !websiteSubOption.trim())) {
      console.warn('Website sub-option is required');
      alert('Please select a website option');
      return;
    }

    // If Local SEO is selected, validate sub-option
    if (serviceName === 'Local SEO' && (!localSEOSubOption || !localSEOSubOption.trim())) {
      console.warn('Local SEO sub-option is required');
      alert('Please select a Local SEO option');
      return;
    }

    // If Web SEO is selected, validate sub-option
    if (serviceName === 'Web SEO' && (!webSEOSubOption || !webSEOSubOption.trim())) {
      console.warn('Web SEO sub-option is required');
      alert('Please select a Web SEO option');
      return;
    }

    // If Social Media is selected, validate sub-option
    if (serviceName === 'Social Media' && (!socialMediaSubOption || !socialMediaSubOption.trim())) {
      console.warn('Social Media sub-option is required');
      alert('Please select a Social Media option');
      return;
    }

    // If Advertisement is selected, validate package text field
    if (serviceName === 'Advertisement' && (!advertisementPackage || !advertisementPackage.trim())) {
      console.warn('Advertisement package is required');
      alert('Please enter the advertisement package');
      return;
    }
    
    if (!productPrice || productPrice.trim() === '' || isNaN(parseFloat(productPrice))) {
      console.warn('Service price is required');
      alert('Please enter a valid service price');
      return;
    }

    const priceValue = parseFloat(productPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      console.warn('Invalid price value');
      alert('Please enter a valid price greater than 0');
      return;
    }

    const vatValue = parseFloat(productVat) || 0;
    const discountValue = parseFloat(productDiscount) || 0;

    // Combine service name with sub-option
    let finalServiceName = serviceName.trim();
    if (serviceName === 'Website' && websiteSubOption) {
      finalServiceName = `${serviceName} - ${websiteSubOption}`;
    } else if (serviceName === 'Local SEO' && localSEOSubOption) {
      // For Local SEO, add "/ το μήνα" to the service name (except for "Κόστος Εγκατάστασης")
      if (localSEOSubOption === 'Κόστος Εγκατάστασης') {
        finalServiceName = `${serviceName} - ${localSEOSubOption}`;
      } else {
        finalServiceName = `${serviceName} - ${localSEOSubOption} / το μήνα`;
      }
    } else if (serviceName === 'Web SEO' && webSEOSubOption) {
      // For Web SEO, add "/ το μήνα" to the first 3 options (not for "Seo Audit")
      if (webSEOSubOption === 'Seo Audit') {
        finalServiceName = `${serviceName} - ${webSEOSubOption}`;
      } else {
        finalServiceName = `${serviceName} - ${webSEOSubOption} / το μήνα`;
      }
    } else if (serviceName === 'Social Media' && socialMediaSubOption) {
      // For Social Media, add "/ το μήνα" to all options
      finalServiceName = `${serviceName} - ${socialMediaSubOption} / το μήνα`;
    } else if (serviceName === 'Advertisement' && advertisementPackage) {
      // For Advertisement, use the package text entered by the user
      finalServiceName = `${serviceName} - ${advertisementPackage}`;
    }

    const newService: Service = {
      id: Date.now().toString(),
      name: finalServiceName,
      price: priceValue,
      vat: vatValue,
      discount: discountValue,
    };

    console.log('Adding service:', newService);
    setServices([...services, newService]);
    setServiceName('');
    setWebsiteSubOption('');
    setLocalSEOSubOption('');
    setWebSEOSubOption('');
    setSocialMediaSubOption('');
    setAdvertisementPackage('');
    setProductPrice('');
    setProductVat('24');
    setProductDiscount('0');
    console.log('Service added successfully');
  };

  const removeService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const calculateSubtotal = () => {
    return services.reduce((sum, s) => {
      const priceAfterDiscount = s.price - (s.price * s.discount) / 100;
      return sum + priceAfterDiscount;
    }, 0);
  };

  const calculateTotalDiscount = () => {
    return services.reduce((sum, s) => {
      return sum + (s.price * s.discount) / 100;
    }, 0);
  };

  const calculateVatAmount = () => {
    // VAT is calculated on each service's price after discount
    return services.reduce((sum, s) => {
      const priceAfterDiscount = s.price - (s.price * s.discount) / 100;
      return sum + (priceAfterDiscount * s.vat) / 100;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVatAmount();
  };

  const handleExportPDF = () => {
    try {
      console.log('Exporting PDF...', { services, companyName, clientName });
      exportToPDF(
        services,
        calculateSubtotal(),
        calculateTotalDiscount(),
        calculateVatAmount(),
        calculateTotal(),
        {
          name: companyName,
          vatNumber: companyVat,
          taxOffice: companyTaxOffice,
        },
        {
          name: clientName,
          vatNumber: clientVat,
          taxOffice: clientTaxOffice,
          address: clientAddress,
        },
        quotationNumber,
        quotationDate,
        documentType
      );
      console.log('PDF export completed');
    } catch (error) {
      console.error('Error in handleExportPDF:', error);
      alert(`Error exporting PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addService();
    }
  };

  const formatGreekNumber = (value: number) => {
    return value.toFixed(2).replace('.', ',');
  };

  return (
    <div className="container">
      <header>
        <h1>Quotation Generator</h1>
        <p>Create and export professional quotations</p>
      </header>

      <div className="main-content">
        <section className="product-form">
          <h2>Add Service</h2>
          <div className="form-group">
            <label htmlFor="document-type">Document Type</label>
            <select
              id="document-type"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              <option value="Quotation">Quotation (Προσφορά)</option>
              <option value="Pro forma invoice">Pro forma invoice (Προτιμολόγιο)</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="service-name">Service</label>
            <select
              id="service-name"
              value={serviceName}
              onChange={(e) => {
                setServiceName(e.target.value);
                // Reset sub-options when service changes
                if (e.target.value !== 'Website') {
                  setWebsiteSubOption('');
                }
                if (e.target.value !== 'Local SEO') {
                  setLocalSEOSubOption('');
                }
                if (e.target.value !== 'Web SEO') {
                  setWebSEOSubOption('');
                }
                if (e.target.value !== 'Social Media') {
                  setSocialMediaSubOption('');
                }
                if (e.target.value !== 'Advertisement') {
                  setAdvertisementPackage('');
                }
              }}
              onKeyPress={handleKeyPress}
            >
              <option value="">Select a service</option>
              <option value="Website">Website</option>
              <option value="Local SEO">Local SEO</option>
              <option value="Web SEO">Web SEO</option>
              <option value="Social Media">Social Media</option>
              <option value="Advertisement">Advertisement</option>
            </select>
          </div>
          {serviceName === 'Website' && (
            <div className="form-group">
              <label htmlFor="website-sub-option">Website Option</label>
              <select
                id="website-sub-option"
                value={websiteSubOption}
                onChange={(e) => setWebsiteSubOption(e.target.value)}
                onKeyPress={handleKeyPress}
              >
                <option value="">Select an option</option>
                <option value="Ξεκίνημα">Ξεκίνημα</option>
                <option value="Ανάπτυξη">Ανάπτυξη</option>
                <option value="E-shop">E-shop</option>
              </select>
            </div>
          )}
          {serviceName === 'Local SEO' && (
            <div className="form-group">
              <label htmlFor="local-seo-sub-option">Local SEO Option</label>
              <select
                id="local-seo-sub-option"
                value={localSEOSubOption}
                onChange={(e) => setLocalSEOSubOption(e.target.value)}
                onKeyPress={handleKeyPress}
              >
                <option value="">Select an option</option>
                <option value="Τοπικό">Τοπικό</option>
                <option value="Κοινότητα">Κοινότητα</option>
                <option value="Περιφέρεια">Περιφέρεια</option>
                <option value="Κόστος Εγκατάστασης">Κόστος Εγκατάστασης</option>
              </select>
            </div>
          )}
          {serviceName === 'Web SEO' && (
            <div className="form-group">
              <label htmlFor="web-seo-sub-option">Web SEO Option</label>
              <select
                id="web-seo-sub-option"
                value={webSEOSubOption}
                onChange={(e) => setWebSEOSubOption(e.target.value)}
                onKeyPress={handleKeyPress}
              >
                <option value="">Select an option</option>
                <option value="Βασικό">Βασικό</option>
                <option value="Ανάπτυξη">Ανάπτυξη</option>
                <option value="Εξουσία">Εξουσία</option>
                <option value="Seo Audit">Seo Audit</option>
              </select>
            </div>
          )}
          {serviceName === 'Social Media' && (
            <div className="form-group">
              <label htmlFor="social-media-sub-option">Social Media Option</label>
              <select
                id="social-media-sub-option"
                value={socialMediaSubOption}
                onChange={(e) => setSocialMediaSubOption(e.target.value)}
                onKeyPress={handleKeyPress}
              >
                <option value="">Select an option</option>
                <option value="Starter Video Pack">Starter Video Pack</option>
                <option value="Growth Video Pack">Growth Video Pack</option>
                <option value="Performance Video Pack">Performance Video Pack</option>
                <option value="Edit Only Pack">Edit Only Pack</option>
              </select>
            </div>
          )}
          {serviceName === 'Advertisement' && (
            <div className="form-group">
              <label htmlFor="advertisement-package">Package</label>
              <input
                id="advertisement-package"
                type="text"
                value={advertisementPackage}
                onChange={(e) => setAdvertisementPackage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter package name"
              />
            </div>
          )}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="product-price">Price (€)</label>
              <input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label htmlFor="product-vat">VAT (%)</label>
              <select
                id="product-vat"
                value={productVat}
                onChange={(e) => setProductVat(e.target.value)}
                onKeyPress={handleKeyPress}
              >
                <option value="0">0%</option>
                <option value="24">24%</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="product-discount">Discount (%)</label>
              <input
                id="product-discount"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={productDiscount}
                onChange={(e) => setProductDiscount(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="0"
              />
            </div>
          </div>
          <button 
            type="button"
            onClick={addService} 
            className="btn btn-primary"
          >
            Add Service
          </button>

          <h2 style={{ marginTop: '2rem' }}>Client Information</h2>
          <div className="form-group">
            <label htmlFor="client-name">Client Name (ΕΠΩΝΥΜΙΑ)</label>
            <input
              id="client-name"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client name"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="client-vat">VAT Number (Α.Φ.Μ.)</label>
              <input
                id="client-vat"
                type="text"
                value={clientVat}
                onChange={(e) => setClientVat(e.target.value)}
                placeholder="Client VAT"
              />
            </div>
            <div className="form-group">
              <label htmlFor="client-tax-office">Tax Office (Δ.Ο.Υ.)</label>
              <input
                id="client-tax-office"
                type="text"
                value={clientTaxOffice}
                onChange={(e) => setClientTaxOffice(e.target.value)}
                placeholder="Client Tax Office"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="client-address">Address (ΔΙΕΥΘΥΝΣΗ)</label>
            <input
              id="client-address"
              type="text"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              placeholder="Client address"
            />
          </div>

          <h2 style={{ marginTop: '2rem' }}>Document Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quotation-number">Quotation Number (ΑΡΙΘΜΟΣ)</label>
              <input
                id="quotation-number"
                type="text"
                value={quotationNumber}
                onChange={(e) => setQuotationNumber(e.target.value)}
                placeholder="Quotation number"
              />
            </div>
            <div className="form-group">
              <label htmlFor="quotation-date">Date (ΗΜΕΡΟΜΗΝΙΑ)</label>
              <input
                id="quotation-date"
                type="text"
                value={quotationDate}
                onChange={(e) => setQuotationDate(e.target.value)}
                placeholder="DD/MM/YYYY"
              />
            </div>
          </div>
        </section>

        <section className="quotation-preview">
          <div className="quotation-header">
            <h2>{documentType === 'Pro forma invoice' ? 'Pro Forma Invoice Preview' : 'Quotation Preview'}</h2>
            {services.length > 0 && (
              <button onClick={handleExportPDF} className="btn btn-export">
                Export as PDF
              </button>
            )}
          </div>

          {services.length === 0 ? (
            <div className="empty-state">
              <p>No services added yet. Start by adding your first service above.</p>
            </div>
          ) : (
            <>
              <div className="quotation-table">
                <table>
                  <thead>
                    <tr>
                      <th>A/A</th>
                      <th>ΠΕΡΙΓΡΑΦΗ - ΑΝΑΛΥΣΗ ΥΠΗΡΕΣΙΑΣ</th>
                      <th>ΑΞΙΑ</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service, index) => {
                      const priceAfterDiscount = service.price - (service.price * service.discount) / 100;
                      const total = priceAfterDiscount + (priceAfterDiscount * service.vat) / 100;
                      return (
                        <tr key={service.id}>
                          <td>{index + 1}</td>
                          <td>
                            {service.name}
                            {service.discount > 0 && (
                              <span style={{ fontSize: '0.85em', color: '#666', display: 'block', marginTop: '2px' }}>
                                (Εκπτώση: {service.discount}%)
                              </span>
                            )}
                          </td>
                          <td>€{formatGreekNumber(total)}</td>
                          <td>
                            <button
                              onClick={() => removeService(service.id)}
                              className="btn-remove"
                              aria-label="Remove service"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="quotation-summary">
                <div className="summary-row">
                  <span>ΚΑΘΑΡΗ ΑΞΙΑ:</span>
                  <span>€{formatGreekNumber(calculateSubtotal())}</span>
                </div>
                {calculateTotalDiscount() > 0 && (
                  <div className="summary-row">
                    <span>ΣΥΝΟΛΙΚΗ ΕΚΠΤΩΣΗ:</span>
                    <span>-€{formatGreekNumber(calculateTotalDiscount())}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Φ.Π.Α.:</span>
                  <span>€{formatGreekNumber(calculateVatAmount())}</span>
                </div>
                <div className="summary-row total">
                  <span>ΤΕΛΙΚΗ ΑΞΙΑ:</span>
                  <span>€{formatGreekNumber(calculateTotal())}</span>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
