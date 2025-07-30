/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table rows: header row should be single column with "Tabs"
  const rows = [['Tabs']];

  // Get the tab navigation bar
  const nav = element.querySelector('nav.secondnavigationbar-body');
  if (!nav) return;

  // Get the top-level tab list
  const tabList = nav.querySelector('ul.secondnavigationbar-body-links');
  if (!tabList) return;

  // Get the tab items
  const tabItems = tabList.querySelectorAll(':scope > li');

  // For each tab item, push a row with [label, content]
  tabItems.forEach((tabItem) => {
    // Tab label: the text of the main anchor
    const tabAnchor = tabItem.querySelector(':scope > a');
    const label = tabAnchor ? tabAnchor.textContent.trim() : '';

    // Tab content: if there is a dropdown, use its list; otherwise, just the anchor
    const subNav = tabItem.querySelector(':scope > div.second-subnav');
    let content;
    if (subNav) {
      const subList = subNav.querySelector('ul.second-subnav-links');
      content = subList || subNav;
    } else {
      content = tabAnchor;
    }
    rows.push([label, content]);
  });

  // Create table with the correct structure
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
