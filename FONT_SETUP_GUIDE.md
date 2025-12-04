# Complete Guide: Getting NotoSans Font Working with jsPDF

## The Problem
Your current `NotoSans-Regular-normal.js` file is missing the **unicode cmap** that jsPDF needs to render Greek characters. This causes the error: "No unicode cmap for font".

## The Solution
You need a font file converted using jsPDF's official font converter, which includes the unicode cmap.

## Step-by-Step Instructions

### Step 1: Download NotoSans TTF

**Option A: Use the automated script**
```bash
npm run download-font
```

**Option B: Download manually**
1. Go to: https://fonts.google.com/noto/specimen/Noto+Sans
2. Click "Download family" or download `NotoSans-Regular.ttf`
3. Save it to `public/NotoSans-Regular.ttf`

### Step 2: Convert the Font

1. **Go to jsPDF Font Converter:**
   - Primary: https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html
   - Backup: https://github.com/MrRio/jsPDF/tree/master/fontconverter
   - Alternative: Search "jsPDF font converter" on Google

2. **Upload the TTF file:**
   - Click "Choose File" or drag and drop
   - Select `public/NotoSans-Regular.ttf` (or wherever you saved it)

3. **Convert:**
   - Click the "Convert" button
   - Wait for the conversion to complete

4. **Download:**
   - The page will generate a `.js` file
   - Download it (it will have a name like `NotoSans-Regular-normal.js`)

### Step 3: Replace the Font File

1. **Replace the existing file:**
   ```bash
   # Copy the downloaded file to:
   src/fonts/NotoSans-Regular-normal.js
   ```

2. **Verify the file structure:**
   The converted file should have:
   - A base64-encoded font string
   - Code that registers the font with jsPDF
   - Proper unicode cmap support

### Step 4: Test

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Test PDF generation:**
   - Add some products with Greek text
   - Export as PDF
   - Verify Greek characters render correctly

## Troubleshooting

### If the converter link doesn't work:
- Try: https://github.com/MrRio/jsPDF/tree/master/fontconverter
- Or search for "jsPDF font converter" and use an alternative tool
- Some developers host their own converters

### If conversion fails:
- Make sure you're using a TTF file (not OTF)
- Try downloading NotoSans from a different source
- Ensure the font file is not corrupted

### If Greek characters still don't render:
- Check browser console for errors
- Verify the font file was properly replaced
- Make sure the font name in the converted file matches what we're using (`NotoSans-Regular`)

## Alternative: Use a Different Library

If jsPDF continues to cause issues, consider:
- **pdfmake**: Better font support, easier to use
- **@react-pdf/renderer**: Already in your dependencies, React-based
- **Puppeteer**: Renders HTML to PDF (best quality, but requires Node.js server)

## Need Help?

If you're still having issues:
1. Check the browser console for specific errors
2. Verify the font file structure
3. Try converting a different font weight (Bold, etc.)
4. Consider using the alternative libraries mentioned above


