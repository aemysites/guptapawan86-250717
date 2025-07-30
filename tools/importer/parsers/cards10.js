/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches block name exactly
  const headerRow = ['Cards (cards10)'];
  const cardRows = [];

  // Each card is inside a .bentobox-item in a .bento-box, in each column
  const columns = element.querySelectorAll(':scope > div');
  columns.forEach(col => {
    const bentoBox = col.querySelector('.bento-box');
    if (!bentoBox) return;
    const bentoItems = bentoBox.querySelectorAll('.bentobox-item');
    bentoItems.forEach(item => {
      // Find all pictures in this card: icon (first), illustration (second, optional)
      const pics = item.querySelectorAll('picture');
      let iconEl = pics[0] || null;
      let illustrationEl = pics[1] || null;
      // Find heading (h3) and paragraph (p) in .column elements
      let heading = null;
      let desc = null;
      const cols = item.querySelectorAll(':scope > .row > .column');
      cols.forEach(cl => {
        if (!heading) {
          heading = cl.querySelector('h3');
        }
        if (!desc) {
          desc = cl.querySelector('p');
        }
      });
      // Compose the text content cell
      const textCellContent = [];
      if (heading) textCellContent.push(heading);
      if (desc) textCellContent.push(desc);
      if (illustrationEl) textCellContent.push(illustrationEl);
      // Only add card row if there is both an icon and some text content
      if (iconEl && textCellContent.length > 0) {
        cardRows.push([iconEl, textCellContent]);
      }
    });
  });
  // Build the table
  const cells = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
