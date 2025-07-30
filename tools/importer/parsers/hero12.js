/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the example
  const headerRow = ['Hero (hero12)'];

  // Extract the bento-box containing the main content
  const bentoBox = element.querySelector('.bento-box');
  if (!bentoBox) {
    // If not found, don't proceed
    return;
  }

  // The .bentobox-item is the main row with two columns
  const bentoItem = bentoBox.querySelector('.bentobox-item');
  if (!bentoItem) {
    return;
  }

  // Find the two main columns: text (left) and image (right)
  const columns = bentoItem.querySelectorAll(':scope > .row > .column');
  if (columns.length < 2) {
    return;
  }
  const textCol = columns[0];
  const imageCol = columns[1];

  // --- Row 2: Background/Image ---
  // Use the <picture> if available, otherwise the first <img>
  let picture = imageCol.querySelector('picture');
  if (!picture) {
    picture = imageCol.querySelector('img');
  }
  // If image is missing, row should be empty
  const row2 = [picture || ''];

  // --- Row 3: Heading, subheading, description, CTA link ---
  // Get eyebrow (h3)
  const eyebrow = textCol.querySelector('h3');

  // Get headline (p.copy.n402AA3)
  const headline = textCol.querySelector('p.n402AA3');

  // Get description (the next p after headline that is not the headline itself, and not visually hidden)
  let description = null;
  if (headline) {
    let next = headline.nextElementSibling;
    while (next) {
      if (next.tagName.toLowerCase() === 'p' && !next.classList.contains('n402AA3') && !next.classList.contains('visuallyhidden')) {
        description = next;
        break;
      }
      next = next.nextElementSibling;
    }
  }

  // Get CTA link (the first a)
  const cta = textCol.querySelector('a');

  // Compose all found content in order
  const content = [];
  if (eyebrow) content.push(eyebrow);
  if (headline) content.push(headline);
  if (description) content.push(description);
  if (cta) content.push(cta);

  const row3 = [content];

  // Compose block table
  const cells = [headerRow, row2, row3];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
