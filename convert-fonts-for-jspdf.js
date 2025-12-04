/**
 * Font Converter for jsPDF
 * 
 * This script helps convert TTF fonts to jsPDF-compatible format.
 * 
 * IMPORTANT: jsPDF requires fonts to be converted using their official font converter
 * which includes unicode cmap support. This script provides instructions.
 * 
 * To properly convert fonts for jsPDF with Greek support:
 * 
 * 1. Go to: https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html
 *    (If that doesn't work, check: https://github.com/MrRio/jsPDF/tree/master/fontconverter)
 * 
 * 2. Download Noto Sans TTF files:
 *    - Regular: https://fonts.google.com/noto/specimen/Noto+Sans
 *    - Bold: https://fonts.google.com/noto/specimen/Noto+Sans (select Bold)
 * 
 * 3. Convert each TTF file using the online converter
 * 
 * 4. The converter will generate a .js file with:
 *    - Base64 encoded font data
 *    - Font metrics (widths, etc.)
 *    - Unicode cmap for character mapping
 * 
 * 5. Save the converted files as:
 *    - src/fonts/NotoSans-Regular.js
 *    - src/fonts/NotoSans-Bold.js
 * 
 * The converted files should export the font data and register it with jsPDF.
 */

console.log(`
╔══════════════════════════════════════════════════════════════╗
║  jsPDF Font Converter Instructions                           ║
╚══════════════════════════════════════════════════════════════╝

To get Greek characters working in your PDFs, you need to convert
the fonts using jsPDF's official font converter.

STEP 1: Download Noto Sans TTF files
  - Regular: https://fonts.google.com/noto/specimen/Noto+Sans
  - Bold: https://fonts.google.com/noto/specimen/Noto+Sans (select Bold)

STEP 2: Use jsPDF Font Converter
  - Visit: https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html
  - OR: https://github.com/MrRio/jsPDF/tree/master/fontconverter
  
STEP 3: Convert each font
  - Upload NotoSans-Regular.ttf → Download converted .js file
  - Upload NotoSans-Bold.ttf → Download converted .js file

STEP 4: Replace the font files
  - Save as: src/fonts/NotoSans-Regular.js
  - Save as: src/fonts/NotoSans-Bold.js

The converted files will have proper unicode cmap support for Greek characters.

Alternative: If the online converter doesn't work, you can also try:
  - https://github.com/parallax/jsPDF-CustomFonts-support
  - Or use a different PDF library like pdfmake or react-pdf
`);


