# How to Get Greek Fonts Working in jsPDF

## The Problem
The current font files are missing the unicode cmap that jsPDF needs to render Greek characters. jsPDF requires fonts in a specific format with proper unicode mappings.

## Solution: Use jsPDF Font Converter

### Option 1: Use jsPDF's Official Font Converter (Recommended)

1. **Go to the jsPDF Font Converter:**
   - Visit: https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html
   - OR use: https://github.com/MrRio/jsPDF/tree/master/fontconverter

2. **Download the Noto Sans TTF files:**
   - Noto Sans Regular: https://fonts.google.com/noto/specimen/Noto+Sans
   - Noto Sans Bold: https://fonts.google.com/noto/specimen/Noto+Sans (select Bold weight)
   - Download the `.ttf` files

3. **Convert the fonts:**
   - Open the font converter page
   - Upload the `NotoSans-Regular.ttf` file
   - Click "Convert"
   - Download the generated `.js` file
   - Repeat for `NotoSans-Bold.ttf`

4. **The converted files will have:**
   - Proper unicode cmap support
   - Font metrics (widths, etc.)
   - Base64 encoded font data
   - A format that jsPDF can actually use

### Option 2: Use Pre-converted Fonts

If you can find pre-converted Noto Sans fonts for jsPDF, you can use those directly.

### Option 3: Use a Different Approach

We could also use a library like `pdfmake` or `react-pdf` that has better font support, but that would require changing the PDF generation code.

## What I Need From You

Please provide one of the following:

1. **Converted font files** - If you convert the fonts using the jsPDF font converter, I can integrate them
2. **TTF files** - If you provide the original TTF files, I can help set up the conversion process
3. **Confirmation** - If you want me to guide you through the conversion step-by-step

The converted files should be `.js` files that export the font data in jsPDF's required format.


