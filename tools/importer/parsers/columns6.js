/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Columns (columns6)'];

  // Find all visible column cells (role="cell")
  const columns = Array.from(element.querySelectorAll(':scope > .compare-row > .compare-column[role="cell"]'))
    .filter(col => {
      const style = (col.getAttribute('style') || '').toLowerCase();
      return !(style.includes('display: none') || style.includes('visibility: hidden'));
    });

  // For each visible column, collect ALL content (including text nodes and elements)
  const contentRow = columns.map(col => {
    // Collect all children (including text nodes, not just elements)
    const nodes = Array.from(col.childNodes);
    // If there's only one node, use it directly
    if (nodes.length === 1) {
      return nodes[0];
    } else if (nodes.length > 1) {
      // Wrap multiple nodes in a <div>
      const wrapper = document.createElement('div');
      nodes.forEach(node => wrapper.appendChild(node));
      return wrapper;
    } else {
      // If the column is empty, return an empty string
      return '';
    }
  });

  // Build the table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
