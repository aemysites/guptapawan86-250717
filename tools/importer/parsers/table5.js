/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per instructions
  const headerRow = ['Table (table5)'];

  // We want to include the selector table with dropdowns as the core block cell
  // This is the div.compare.selector-table.with-fullwidthrowheader
  // In the provided HTML this is the second child div of the top-level element

  // Defensive: If element has no children, replace with just the header row
  const children = element.querySelectorAll(':scope > div');
  let contentCell = null;
  for (const child of children) {
    if (child.classList && child.classList.contains('compare') && child.classList.contains('selector-table')) {
      contentCell = child;
      break;
    }
  }
  // If not found, just use the whole element as fallback (edge case)
  if (!contentCell) contentCell = element;

  const cells = [
    headerRow,
    [contentCell]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
