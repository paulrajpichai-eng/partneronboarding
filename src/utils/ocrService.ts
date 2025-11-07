import Tesseract from 'tesseract.js';

export interface BankingDetails {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  rawText: string;
}

export class OCRService {
  private static instance: OCRService;
  
  public static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

  async extractBankingDetails(imageFile: File): Promise<BankingDetails> {
    try {
      // Initialize Tesseract worker
      const worker = await Tesseract.createWorker('eng');
      
      // Configure for better banking document recognition
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .-/',
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
      });

      // Perform OCR
      const { data: { text } } = await worker.recognize(imageFile);
      
      // Clean up worker
      await worker.terminate();

      // Extract banking details from OCR text
      const bankingDetails = this.parseBankingDetails(text);
      
      return {
        ...bankingDetails,
        rawText: text
      };
    } catch (error) {
      console.error('OCR processing failed:', error);
      throw new Error('Failed to extract banking details from image');
    }
  }

  private parseBankingDetails(text: string): Omit<BankingDetails, 'rawText'> {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    let accountHolderName = '';
    let accountNumber = '';
    let bankName = '';
    let ifscCode = '';

    // Common bank name patterns
    const bankPatterns = [
      /(?:STATE BANK OF INDIA|SBI)/i,
      /(?:HDFC BANK|HDFC)/i,
      /(?:ICICI BANK|ICICI)/i,
      /(?:AXIS BANK|AXIS)/i,
      /(?:KOTAK MAHINDRA BANK|KOTAK)/i,
      /(?:PUNJAB NATIONAL BANK|PNB)/i,
      /(?:BANK OF BARODA|BOB)/i,
      /(?:CANARA BANK)/i,
      /(?:UNION BANK)/i,
      /(?:INDIAN BANK)/i,
      /(?:CENTRAL BANK)/i,
      /(?:SYNDICATE BANK)/i,
      /(?:ORIENTAL BANK)/i,
      /(?:ALLAHABAD BANK)/i,
      /(?:ANDHRA BANK)/i,
      /(?:CORPORATION BANK)/i,
      /(?:INDIAN OVERSEAS BANK|IOB)/i,
      /(?:PUNJAB AND SIND BANK)/i,
      /(?:UCO BANK)/i,
      /(?:VIJAYA BANK)/i,
      /(?:DENA BANK)/i,
      /(?:YES BANK)/i,
      /(?:INDUSIND BANK)/i,
      /(?:FEDERAL BANK)/i,
      /(?:SOUTH INDIAN BANK)/i,
      /(?:KARUR VYSYA BANK|KVB)/i,
      /(?:TAMILNAD MERCANTILE BANK)/i,
      /(?:CITY UNION BANK)/i,
      /(?:DHANLAXMI BANK)/i,
      /(?:LAKSHMI VILAS BANK|LVB)/i,
      /(?:NAINITAL BANK)/i,
      /(?:RATNAKAR BANK)/i,
      /(?:JAMMU AND KASHMIR BANK|J&K BANK)/i,
      /(?:DEUTSCHE BANK)/i,
      /(?:STANDARD CHARTERED)/i,
      /(?:CITIBANK)/i,
      /(?:HSBC)/i,
      /(?:AMERICAN EXPRESS)/i,
      /(?:BANK)/i
    ];

    // Extract IFSC Code (format: 4 letters + 7 digits/characters)
    const ifscPattern = /\b[A-Z]{4}[0-9A-Z]{7}\b/g;
    const ifscMatches = text.match(ifscPattern);
    if (ifscMatches && ifscMatches.length > 0) {
      ifscCode = ifscMatches[0];
    }

    // Extract Account Number (typically 9-18 digits)
    const accountPatterns = [
      /\b\d{9,18}\b/g,
      /(?:A\/C|ACCOUNT|ACC)[\s:]*(\d{9,18})/gi,
      /(?:NO|NUMBER)[\s:]*(\d{9,18})/gi
    ];

    for (const pattern of accountPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        // Find the longest number (likely to be account number)
        const numbers = matches.filter(match => /^\d+$/.test(match.replace(/\D/g, '')));
        if (numbers.length > 0) {
          accountNumber = numbers.reduce((a, b) => a.length > b.length ? a : b).replace(/\D/g, '');
          break;
        }
      }
    }

    // Extract Bank Name
    for (const pattern of bankPatterns) {
      const match = text.match(pattern);
      if (match) {
        bankName = match[0].toUpperCase();
        break;
      }
    }

    // Extract Account Holder Name
    // Look for patterns that might indicate account holder name
    const namePatterns = [
      /(?:PAY|PAYEE)[\s:]+([A-Z\s]{3,50})/i,
      /(?:NAME|HOLDER)[\s:]+([A-Z\s]{3,50})/i,
      /(?:MR|MS|MRS|DR)[\s\.]+([A-Z\s]{3,50})/i
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        accountHolderName = match[1].trim().toUpperCase();
        break;
      }
    }

    // If no specific pattern found, try to find the most likely name
    if (!accountHolderName) {
      const words = text.split(/\s+/);
      const potentialNames = [];
      
      for (let i = 0; i < words.length - 1; i++) {
        const word1 = words[i];
        const word2 = words[i + 1];
        
        // Look for two consecutive capitalized words that could be a name
        if (word1.length > 2 && word2.length > 2 && 
            /^[A-Z][a-z]+$/.test(word1) && /^[A-Z][a-z]+$/.test(word2)) {
          potentialNames.push(`${word1} ${word2}`);
        }
      }
      
      if (potentialNames.length > 0) {
        accountHolderName = potentialNames[0].toUpperCase();
      }
    }

    // Clean up extracted data
    accountHolderName = this.cleanText(accountHolderName);
    bankName = this.cleanText(bankName);
    
    return {
      accountHolderName,
      accountNumber,
      bankName,
      ifscCode
    };
  }

  private cleanText(text: string): string {
    return text
      .replace(/[^\w\s&.-]/g, '') // Remove special characters except &, ., -
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  }

  // Validate extracted banking details
  validateBankingDetails(details: BankingDetails): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!details.accountHolderName || details.accountHolderName.length < 3) {
      errors.push('Account holder name not found or too short');
    }

    if (!details.accountNumber || details.accountNumber.length < 9 || details.accountNumber.length > 18) {
      errors.push('Invalid account number format');
    }

    if (!details.ifscCode || !/^[A-Z]{4}[0-9A-Z]{7}$/.test(details.ifscCode)) {
      errors.push('Invalid IFSC code format');
    }

    if (!details.bankName || details.bankName.length < 3) {
      errors.push('Bank name not found');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Preprocess image for better OCR results
  async preprocessImage(file: File): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Set canvas size
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Convert to grayscale and increase contrast
        for (let i = 0; i < data.length; i += 4) {
          const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
          
          // Increase contrast
          const contrast = 1.5;
          const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
          const enhancedGray = Math.min(255, Math.max(0, factor * (gray - 128) + 128));
          
          data[i] = enhancedGray;     // Red
          data[i + 1] = enhancedGray; // Green
          data[i + 2] = enhancedGray; // Blue
          // Alpha channel remains unchanged
        }
        
        // Put processed image data back
        ctx.putImageData(imageData, 0, 0);
        
        // Convert canvas to blob and then to file
        canvas.toBlob((blob) => {
          if (blob) {
            const processedFile = new File([blob], file.name, { type: 'image/png' });
            resolve(processedFile);
          } else {
            resolve(file); // Return original if processing fails
          }
        }, 'image/png');
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
}

export const ocrService = OCRService.getInstance();