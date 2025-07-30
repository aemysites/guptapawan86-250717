/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required by the block spec (EXACT header, one column)
  const headerRow = ['Table (table9)'];

  // Find all compare-row elements. Each is a single row in the table.
  const compareRows = Array.from(element.querySelectorAll(':scope > .compare-row'));
  if (!compareRows.length) return;

  // Compute visible columns by inspecting each row, using the maximum found across all rows.
  let maxColCount = 0;
  const visibleColumnsByRow = compareRows.map(row => {
    // Only visible columns (display!=none && visibility!=hidden)
    const cols = Array.from(row.querySelectorAll(':scope > .compare-column'))
      .filter(col => {
        const style = window.getComputedStyle(col);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
    if (cols.length > maxColCount) maxColCount = cols.length;
    return cols;
  });

  // For each .compare-column, reference the main content
  function getCellContent(col) {
    // Reference the .stat-content element directly if it exists, else the column
    const statContent = col.querySelector('.stat-content');
    if (statContent) return statContent;
    // If no .stat-content, reference the entire column
    return col;
  }

  // Build table rows: header, then one row per compare-row (cells: one per visible column, referencing real elements)
  const tableRows = [headerRow];
  visibleColumnsByRow.forEach(cols => {
    const row = [];
    for (let i = 0; i < maxColCount; i++) {
      if (cols[i]) {
        row.push(getCellContent(cols[i]));
      } else {
        row.push('');
      }
    }
    tableRows.push(row);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
