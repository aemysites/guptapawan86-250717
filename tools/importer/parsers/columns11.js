/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the main card content from each column
  function extractColumnContent(column) {
    const bentoBox = column.querySelector('.bento-box');
    if (bentoBox) {
      const bentoItem = bentoBox.querySelector('.bentobox-item');
      if (bentoItem) return bentoItem;
      return bentoBox;
    }
    return column;
  }

  // Get all top-level columns
  const columns = Array.from(element.querySelectorAll(':scope > .column'));
  if (columns.length === 0) {
    // fallback: use all direct children
    columns.push(...element.children);
  }

  // Extract content for each column
  const rowCells = columns.map(col => extractColumnContent(col));

  // Header row must have the same number of columns as the content row
  const headerRow = ['Columns (columns11)'];
  while (headerRow.length < rowCells.length) {
    headerRow.push('');
  }

  const cells = [headerRow, rowCells];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
