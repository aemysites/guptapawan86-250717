/* global WebImporter */
export default function parse(element, { document }) {
  // Table (table5) block header
  const headerRow = ['Table (table5)'];

  // Find the selector table that contains the dropdowns and all relevant text
  const selectorTable = element.querySelector('.selector-table.with-fullwidthrowheader[role="rowgroup"]');

  // If found, include the entire selector table as a single cell
  // If not found, fallback to the original element (should not usually happen)
  const tableContent = selectorTable || element;

  // Second row, single cell containing all the dropdowns and their associated labels/text (all content)
  const contentRow = [tableContent];

  // Compose final table structure
  const rows = [headerRow, contentRow];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
