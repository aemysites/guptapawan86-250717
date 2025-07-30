/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must always be a single cell
  const headerRow = ['Columns (columns13)'];

  // Extract all <a> links (social icons)
  const links = Array.from(element.querySelectorAll('a'));

  // Data row: as many columns as there are links
  const dataRow = links.length > 0 ? links : [''];

  // Compose the table: single-cell header, multi-cell data row
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    dataRow
  ], document);

  element.replaceWith(table);
}
