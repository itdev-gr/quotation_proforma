/**
 * Convert TTF fonts to jsPDF format
 * 
 * This script converts the TTF files to base64 and prepares them for jsPDF.
 * However, for full unicode support, you still need to use jsPDF's official
 * font converter which includes the unicode cmap.
 * 
 * Run: node convert-ttf-to-jspdf.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to TTF files
const regularTTF = path.join(__dirname, 'public', 'NotoSans-Regular.ttf');
const boldTTF = path.join(__dirname, 'public', 'NotoSans-Bold.ttf');

// Output paths
const regularJS = path.join(__dirname, 'src', 'fonts', 'NotoSans-Regular.js');
const boldJS = path.join(__dirname, 'src', 'fonts', 'NotoSans-Bold.js');

function convertTTFToBase64(ttfPath) {
  try {
    const fontBuffer = fs.readFileSync(ttfPath);
    const base64 = fontBuffer.toString('base64');
    return base64;
  } catch (error) {
    console.error(`Error reading ${ttfPath}:`, error);
    return null;
  }
}

function createJSFile(base64, fontName, outputPath) {
  const jsContent = `// ${fontName} font for jsPDF
// Generated from TTF file
// NOTE: This is a basic conversion. For full unicode support, use jsPDF's official font converter:
// https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html

const ${fontName.replace(/-/g, '_')}_base64 = '${base64}';

// Add to jsPDF's Virtual File System
if (typeof window !== 'undefined' && window.jsPDF) {
  window.jsPDF.API.addFileToVFS('${fontName}-normal.ttf', ${fontName.replace(/-/g, '_')}_base64);
}

// Export for use in loadGreekFont.ts
export default ${fontName.replace(/-/g, '_')}_base64;
`;

  try {
    fs.writeFileSync(outputPath, jsContent);
    console.log(`✓ Created ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`Error writing ${outputPath}:`, error);
    return false;
  }
}

console.log('Converting TTF files to jsPDF format...\n');

// Convert Regular font
console.log('Converting NotoSans-Regular.ttf...');
const regularBase64 = convertTTFToBase64(regularTTF);
if (regularBase64) {
  createJSFile(regularBase64, 'NotoSans-Regular', regularJS);
  console.log(`  Base64 length: ${regularBase64.length} characters\n`);
} else {
  console.error('  ✗ Failed to convert Regular font\n');
}

// Convert Bold font
console.log('Converting NotoSans-Bold.ttf...');
const boldBase64 = convertTTFToBase64(boldTTF);
if (boldBase64) {
  createJSFile(boldBase64, 'NotoSans-Bold', boldJS);
  console.log(`  Base64 length: ${boldBase64.length} characters\n`);
} else {
  console.error('  ✗ Failed to convert Bold font\n');
}

console.log('Conversion complete!');
console.log('\n⚠️  IMPORTANT: This basic conversion may not include unicode cmap.');
console.log('   For full Greek character support, use jsPDF\'s official font converter:');
console.log('   https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html');
console.log('\n   The converted files will have proper unicode support for Greek characters.');


