/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Columns (columns11) block: extract two columns, each containing its content box
  // Each column is a direct child of the element (with class 'column large-6 small-12 ...')

  // Get all top-level columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, find the main content area -- the bentobox-item (or fallback to bentobox)
  const contentCells = columns.map(col => {
    // look for .bento-box > .bentobox-item as the main content container
    const bentoBox = col.querySelector('.bento-box');
    if (bentoBox) {
      const bentoItem = bentoBox.querySelector('.bentobox-item');
      // Defensive: fallback to bentoBox if no bentoItem
      return bentoItem || bentoBox;
    }
    // fallback: if empty, just return an empty div
    return document.createElement('div');
  });

  // Table format: header row, then one row with the two columns
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns11)'],
    contentCells
  ], document);

  // Replace the original element with the block
  element.replaceWith(table);
}
