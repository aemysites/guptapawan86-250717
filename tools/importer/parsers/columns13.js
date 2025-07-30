/* global WebImporter */
export default function parse(element, { document }) {
  // Collect all direct <a> children (social icon links)
  const links = Array.from(element.querySelectorAll('a'));
  // Block header row: always a single cell
  const headerRow = ['Columns (columns13)'];
  // Content row: as many columns as links (or empty string if none)
  const contentRow = links.length ? links : [''];
  // Build the table: single cell header, then content row of N columns
  const cells = [
    headerRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
