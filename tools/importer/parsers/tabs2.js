/* global WebImporter */
export default function parse(element, { document }) {
  // Get the navigation container
  const nav = element.querySelector('nav.secondnavigationbar-body');
  if (!nav) return;

  // Get all main tab <li>s (children of .secondnavigationbar-body-links)
  const mainUl = nav.querySelector('ul.secondnavigationbar-body-links');
  if (!mainUl) return;
  const tabLis = Array.from(mainUl.children).filter(li => li.tagName === 'LI');

  // Build all tab rows first
  const tabRows = tabLis.map(li => {
    // Get tab label: text content of direct <a>
    const labelA = li.querySelector(':scope > a');
    let label = '';
    if (labelA) {
      // Use the text node only, excluding child span (icon)
      label = Array.from(labelA.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent)
        .join('')
        .trim();
    }
    // Get the tab content: subnav links or just the main link
    let content;
    const subnav = li.querySelector(':scope > .second-subnav');
    if (subnav) {
      // Reference the <ul> of links directly if present
      const subUl = subnav.querySelector('ul.second-subnav-links');
      if (subUl) {
        content = subUl;
      } else {
        content = subnav;
      }
    } else {
      // No subnav, just reference the main link
      content = labelA;
    }
    // Each tab row: [label, content]
    return [label, content];
  });

  // Compose header row: single cell with 'Tabs'.
  // We'll set the colspan on the header cell after the table is created.
  const rows = [['Tabs'], ...tabRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Set the colspan on the header cell to 2 for alignment, only if there are tab rows
  const headerTr = block.querySelector('tr');
  if (headerTr && tabRows.length > 0) {
    const th = headerTr.querySelector('th');
    if (th) th.setAttribute('colspan', '2');
  }

  // Replace the original element
  element.replaceWith(block);
}
