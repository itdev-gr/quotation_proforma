/**
 * Automated Font Converter for jsPDF
 * 
 * This script helps you get a properly converted NotoSans font for jsPDF.
 * 
 * IMPORTANT: The jsPDF font converter requires a browser environment.
 * This script provides instructions and can download the TTF file for you.
 * 
 * Steps:
 * 1. Run this script to download NotoSans TTF
 * 2. Manually convert using the jsPDF font converter
 * 3. Replace the font file in src/fonts/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FONT_URL = 'https://github.com/google/fonts/raw/main/ofl/notosans/NotoSans-Regular.ttf';
const OUTPUT_DIR = path.join(__dirname, 'public');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'NotoSans-Regular.ttf');

async function downloadFont() {
  return new Promise((resolve, reject) => {
    console.log('Downloading NotoSans-Regular.ttf from Google Fonts...');
    
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const file = fs.createWriteStream(OUTPUT_FILE);
    
    https.get(FONT_URL, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log('✓ Font downloaded successfully!');
            console.log(`  Location: ${OUTPUT_FILE}`);
            resolve();
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('✓ Font downloaded successfully!');
          console.log(`  Location: ${OUTPUT_FILE}`);
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(OUTPUT_FILE, () => {});
      reject(err);
    });
  });
}

async function main() {
  try {
    await downloadFont();
    
    console.log('\n' + '='.repeat(60));
    console.log('Next Steps:');
    console.log('='.repeat(60));
    console.log('1. Go to: https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html');
    console.log('   (If that link doesn\'t work, try: https://github.com/MrRio/jsPDF/tree/master/fontconverter)');
    console.log('\n2. Upload the downloaded file:');
    console.log(`   ${OUTPUT_FILE}`);
    console.log('\n3. Click "Convert"');
    console.log('\n4. Download the generated .js file');
    console.log('\n5. Replace src/fonts/NotoSans-Regular-normal.js with the downloaded file');
    console.log('\n6. Restart your development server');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('Error downloading font:', error.message);
    console.log('\nAlternative: Download manually from:');
    console.log('https://fonts.google.com/noto/specimen/Noto+Sans');
    console.log('Then convert using: https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html');
  }
}

main();


