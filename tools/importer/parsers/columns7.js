/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the compare row containing the column cells
  const row = element.querySelector('.compare-row.compare-template-preview-item-color-nav');
  if (!row) return;

  // Select all visible columns (cells)
  const columns = Array.from(row.querySelectorAll(':scope > .compare-column[role="cell"]')).filter(col => {
    const style = col.getAttribute('style') || '';
    return !/display:\s*none/.test(style) && !/visibility:\s*hidden/.test(style);
  });

  // For each column, extract its content as an array of elements (all non-empty direct children of .row-colors)
  const colCells = columns.map(col => {
    const rowColors = col.querySelector('.row-colors');
    if (rowColors) {
      const content = Array.from(rowColors.childNodes).filter(n => {
        return (n.nodeType === 1) || (n.nodeType === 3 && n.textContent.trim());
      });
      if (content.length > 0) return content;
      return rowColors;
    }
    // fallback: all children of the col
    const fallback = Array.from(col.childNodes).filter(n => (n.nodeType === 1) || (n.nodeType === 3 && n.textContent.trim()));
    if (fallback.length > 0) return fallback;
    return col;
  });

  // Table header (one column, per spec)
  const tableRows = [
    ['Columns (columns7)'],
    colCells
  ];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
