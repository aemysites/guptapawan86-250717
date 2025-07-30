/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the list of cards
  const cardList = element.querySelector('ul.list');
  if (!cardList) return;

  const cards = Array.from(cardList.children).filter(li => li.matches('li'));

  const cells = [['Cards (cards4)']];

  cards.forEach(card => {
    // IMAGE: Find first <img> in card
    let img = card.querySelector('picture img');

    // TEXT: Find all relevant text blocks (p, span.copy)
    let textColumn = card.querySelector('.bento-box, .bentobox-item, .column');
    let textNodes = [];
    if (textColumn) {
      // Prioritize <p> and <span class="copy">
      textNodes = Array.from(textColumn.querySelectorAll('p, span.copy'));
    }
    if (!textNodes.length) {
      // Fallback: all <p> and <span class="copy"> under card
      textNodes = Array.from(card.querySelectorAll('p, span.copy'));
    }
    // Remove visuallyhidden
    textNodes = textNodes.filter(n => !n.classList.contains('visuallyhidden'));
    // Fallback: if no nodes, pick all <p> or <span>
    if (!textNodes.length) {
      textNodes = Array.from(card.querySelectorAll('p, span'));
    }

    let textContent = null;
    if (textNodes.length === 1) {
      textContent = textNodes[0];
    } else if (textNodes.length > 1) {
      // Use a fragment with all text nodes in-order (not clones)
      const frag = document.createDocumentFragment();
      textNodes.forEach(node => frag.appendChild(node));
      textContent = frag;
    }

    cells.push([
      img,
      textContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
