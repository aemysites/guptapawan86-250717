/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must have exactly one cell as per spec
  const headerRow = ['Columns (columns8)'];

  // Get all visible columns in the compare block
  const columns = Array.from(element.querySelectorAll('.compare-column[role="cell"]')).filter(col => {
    const style = col.style;
    if ((style.display && style.display === 'none') || (style.visibility && style.visibility === 'hidden')) return false;
    const computed = window.getComputedStyle(col);
    return computed.display !== 'none' && computed.visibility !== 'hidden';
  });

  // Each content cell is all contents of the column (preserve text, buttons, etc)
  // Reference the existing children from the DOM
  const contentCells = columns.map(col => Array.from(col.childNodes).filter(n => !(n.nodeType === Node.TEXT_NODE && n.textContent.trim() === '')));

  // Table structure: first row = single header cell, second row = N columns
  const tableData = [headerRow, contentCells];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
