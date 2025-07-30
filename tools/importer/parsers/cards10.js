/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the table header
  const headerRow = ['Cards (cards10)'];
  const cells = [headerRow];

  // The cards are in two columns, each with a bento-box with one bentobox-item each
  const columns = element.querySelectorAll(':scope > div.column');
  columns.forEach((column) => {
    const bentoBox = column.querySelector(':scope > .bento-box');
    if (!bentoBox) return;
    const card = bentoBox.querySelector(':scope > .bentobox-item');
    if (!card) return;
    
    // Find the (small) icon at the top, title & description, and the image at the bottom
    // Find the first .column that has a <picture> as child (icon)
    let icon = null;
    let mainImage = null;
    let title = null;
    let desc = null;
    
    const iconCol = card.querySelector(':scope > .row > .column');
    if (iconCol) {
      icon = iconCol.querySelector('picture,img');
    }

    // There are three columns, the 2nd has text, the 3rd has main image
    const textCol = card.querySelector('.column.large-12.j6C8F63, .column.large-12.b17F598');
    if (textCol) {
      title = textCol.querySelector('h3');
      desc = textCol.querySelector('p');
    }
    const imgCol = card.querySelector('.column.large-12.u5C8722, .column.large-12.s074652');
    if (imgCol) {
      mainImage = imgCol.querySelector('picture,img');
    }
    // Compose first cell (image(s)), second cell (text)
    const firstCellContent = [];
    if (icon) firstCellContent.push(icon);
    if (mainImage) firstCellContent.push(mainImage);
    const cardImageCell = (firstCellContent.length === 1) ? firstCellContent[0] : firstCellContent;
    const textContent = [];
    if (title) textContent.push(title);
    if (desc) textContent.push(desc);
    const cardTextCell = (textContent.length === 1) ? textContent[0] : textContent;
    // Only add row if there is at least one cell with content
    if (firstCellContent.length > 0 || textContent.length > 0) {
      cells.push([cardImageCell, cardTextCell]);
    }
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
