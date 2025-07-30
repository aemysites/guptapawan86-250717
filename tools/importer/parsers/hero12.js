/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find content containers
  const bento = element.querySelector('.bento-box');
  if (!bento) return;
  const bentoboxItem = bento.querySelector('.bentobox-item');
  if (!bentoboxItem) return;
  // Get both columns (left = text, right = image)
  const columns = bentoboxItem.querySelectorAll(':scope > .row > .column');
  let textCol, imageCol;
  // Usually left column contains the text, right column contains image
  if (columns.length >= 2) {
    textCol = columns[0];
    imageCol = columns[1];
  } else {
    // fallback to class selectors
    textCol = bentoboxItem.querySelector('.column.large-6.medium-6.small-12');
    imageCol = bentoboxItem.querySelector('.column.large-6.medium-6.small-12.y0698D3');
  }

  // 2. Extract the image for the image row
  let imageEl = null;
  if (imageCol) {
    const picture = imageCol.querySelector('picture');
    if (picture) {
      imageEl = picture.querySelector('img');
    }
  }

  // 3. Extract structured text content for the content row
  const textContent = [];
  if (textCol) {
    // Eyebrow/heading
    const title = textCol.querySelector('h3');
    if (title) textContent.push(title);
    // Headline (bigger)
    const subheading = textCol.querySelector('p.n402AA3');
    if (subheading) textContent.push(subheading);
    // Description
    const description = textCol.querySelector('p.helvetica-neue, p.tE894C7');
    if (description) textContent.push(description);
    // CTA (standalone link)
    const cta = textCol.querySelector('a.link-standalone');
    if (cta) textContent.push(cta);
  }

  // Compose the table per specification
  const headerRow = ['Hero (hero12)'];
  const imageRow = [imageEl ? imageEl : ''];
  const textRow = [textContent.length > 0 ? textContent : ''];
  const cells = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
