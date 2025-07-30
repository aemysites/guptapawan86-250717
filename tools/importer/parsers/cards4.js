/* global WebImporter */
export default function parse(element, { document }) {
  // Find the list of cards
  const cardsList = element.querySelector('ul[role="list"]');
  if (!cardsList) return;
  const cardItems = Array.from(cardsList.querySelectorAll(':scope > li'));
  const rows = [['Cards (cards4)']];

  cardItems.forEach((li) => {
    // IMAGE: Find first <img> in the card
    let image = li.querySelector('img');
    let imageEl = null;
    if (image) {
      imageEl = image.closest('picture') || image;
    }
    // TEXT: Collect all <p> and <span.copy> in card (in visual order)
    // Identify the best text container (deepest .bentobox-item, .bento-box, or .column in li; fallback to li)
    let contentContainer = li.querySelector('.bentobox-item,.bento-box,.column') || li;
    // Get all <p> and <span.copy> in visual order
    let textNodes = [];
    let walk = (node) => {
      node.childNodes.forEach((child) => {
        if (child.nodeType === 1) {
          if (child.matches('p')) textNodes.push(child);
          else if (child.matches('span.copy')) textNodes.push(child);
          else walk(child);
        }
      });
    };
    walk(contentContainer);
    // If no <p> or <span.copy>, try to get all <span> with text
    if (textNodes.length === 0) {
      let moreSpans = Array.from(contentContainer.querySelectorAll('span')).filter(s=>s.textContent.trim());
      textNodes = moreSpans.length ? moreSpans : [];
    }
    // Some cards contain a compare/selector panel; include these if present
    const comparePanel = contentContainer.querySelector('.upgraders-select-label')?.closest('div');
    let extra = [];
    if (comparePanel) {
      // Include comparePanel and its sibling rows (stat tables etc.)
      extra.push(comparePanel);
      let next = comparePanel.nextElementSibling;
      while (next && next.matches('.selector-element-gallery, .row, .d82C4C2, .w16245D, .row, .column')) {
        extra.push(next);
        next = next.nextElementSibling;
      }
    }
    // Merge text and extras
    let cellContent = [];
    if (textNodes.length) cellContent = [...textNodes];
    if (extra.length) cellContent.push(...extra);
    if (cellContent.length === 0) {
      // fallback: whole text content in a <p> if nothing else
      const fallback = document.createElement('p');
      fallback.textContent = contentContainer.textContent.trim();
      cellContent.push(fallback);
    }
    // Only use array if >1 nodes
    let textCell = cellContent.length === 1 ? cellContent[0] : cellContent;
    // Add to rows
    rows.push([imageEl, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
