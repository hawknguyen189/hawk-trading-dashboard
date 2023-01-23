// Import the necessary modules
import { PDFDocument, StandardFonts } from "pdf-lib";

// Create a new PDFDocument
const pdfDoc = await PDFDocument.create();

// Load the JPEG image
const jpegBytes = await fetch("path/to/image.jpeg").then((res) =>
  res.arrayBuffer()
);
const jpegImage = await pdfDoc.embedJpeg(jpegBytes);

// Get the width and height of the image
const { width, height } = jpegImage.scale(0.5);

// Add the image to the first page of the PDF
const page = pdfDoc.addPage([width, height]);
page.drawImage(jpegImage, {
  x: page.getWidth() / 2 - width / 2,
  y: page.getHeight() / 2 - height / 2,
  width,
  height,
});

// Add some text to the PDF
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
const text = "This is some text";
const textSize = 30;
const textWidth = font.widthOfTextAtSize(text, textSize);
const textHeight = font.heightAtSize(textSize);
page.drawText(text, {
  x: page.getWidth() / 2 - textWidth / 2,
  y: page.getHeight() - textHeight - 20,
  size: textSize,
  font: font,
  color: rgb(0, 0, 0),
});

// Save the PDF to a file
const pdfBytes = await pdfDoc.save();
fs.writeFileSync("path/to/output.pdf", pdfBytes);
 
