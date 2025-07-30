/* global WebImporter */
export default function parse(element, { document }) {
  // Find all visible columns (not display:none or visibility:hidden)
  const columns = Array.from(element.querySelectorAll('.compare-column[role="cell"]')).filter(col => {
    const style = col.getAttribute('style') || '';
    return !style.match(/display:\s*none/) && !style.match(/visibility:\s*hidden/);
  });

  // For each visible column, collect all children (including text) as content
  const columnCells = columns.map(col => {
    // Grab all child nodes (including text, buttons, whitespace, etc.)
    // Filter out empty text nodes
    const contentNodes = Array.from(col.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim() !== '';
      }
      return true;
    });
    // If only one node, return it directly. Else, return array.
    if (contentNodes.length === 1) {
      return contentNodes[0];
    }
    return contentNodes;
  });

  // The header row must be a single cell (one column), then second row has all columns
  const cells = [
    ['Columns (columns8)'], // Header: one single cell
    columnCells            // Second row: N columns
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
