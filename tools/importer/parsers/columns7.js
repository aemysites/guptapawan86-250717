/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Columns (columns7)'];

  // Find all visible column cells (dont include display:none or visibility:hidden)
  const columnElements = Array.from(
    element.querySelectorAll(':scope > div.compare-row > div.compare-column[role="cell"]')
  ).filter(col => {
    const style = col.getAttribute('style') || '';
    if (/display:\s*none/.test(style) || /visibility:\s*hidden/.test(style)) {
      return false;
    }
    return true;
  });

  // For each column, get everything inside .row-colors (retain text, swatches, and labels)
  const columnCells = columnElements.map(col => {
    const inner = col.querySelector('.row-colors');
    if (!inner) return '';
    // Get all direct children (including text nodes and elements)
    // This includes whitespace text nodes, so filter out just empty text
    const nodes = Array.from(inner.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });
    // If only one node, don't wrap in array
    if (nodes.length === 1) return nodes[0];
    return nodes;
  });

  // Only create the table if there is at least one column
  if (!columnCells.length) return;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnCells
  ], document);
  element.replaceWith(table);
}
