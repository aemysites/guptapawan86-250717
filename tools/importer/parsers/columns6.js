/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main compare-row (should be direct child)
  const row = element.querySelector(':scope > .compare-row');
  if (!row) {
    // fallback: replace whole element as single cell
    const table = WebImporter.DOMUtils.createTable([
      ['Columns (columns6)'],
      [element]
    ], document);
    element.replaceWith(table);
    return;
  }

  // Gather all visible compare-column(s), preserving order
  const columns = Array.from(row.querySelectorAll(':scope > .compare-column'));
  const visibleColumns = columns.filter(col => {
    const style = col.getAttribute('style') || '';
    return !/display:\s*none/.test(style) && !/visibility:\s*hidden/.test(style);
  });

  // For each visible column, grab its full content (all child nodes)
  const cellElements = visibleColumns.map(col => {
    // If the column has no children, return it as is
    if (!col.childNodes.length) return col;
    // If the column has a single child, return that child (preserve text/figures)
    if (col.childNodes.length === 1) return col.firstChild;
    // If the column has multiple child nodes, wrap them in a fragment to preserve all content
    const frag = document.createDocumentFragment();
    Array.from(col.childNodes).forEach(node => frag.appendChild(node));
    return frag;
  });

  // Build the block table: first row = header, second row = each column's content
  const cells = [
    ['Columns (columns6)'],
    cellElements
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Set header colspan to match number of columns
  const headerRow = table.querySelector('tr:first-child');
  if (headerRow && headerRow.children.length === 1) {
    headerRow.children[0].setAttribute('colspan', cellElements.length);
  }

  element.replaceWith(table);
}
