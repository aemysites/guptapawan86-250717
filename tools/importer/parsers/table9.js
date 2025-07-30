/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row as specified by the block name
  const cells = [['Table (table9)']];
  // For each compare-row, collect all visible columns, and reference their current DOM nodes
  const rows = Array.from(element.querySelectorAll(':scope > .compare-row'));
  rows.forEach(row => {
    // Find all visible compare-column children
    const columns = Array.from(row.querySelectorAll(':scope > .compare-column')).filter(col => {
      // Check both visibility and display for robustness
      const style = col.getAttribute('style') || '';
      const isVisible = /visibility:\s*visible/.test(style) && !/display:\s*none/.test(style);
      return isVisible;
    });
    if (columns.length > 0) {
      // Put all visible columns into a single table cell as an array, so all text is included
      cells.push([columns]);
    }
  });
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
