/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the first picture (background image) in the q540661 row
  let backgroundPicture = null;
  const bgRow = element.querySelector('.row.q540661');
  if (bgRow) {
    const bgPicture = bgRow.querySelector('picture');
    if (bgPicture) backgroundPicture = bgPicture;
  }

  // Compose the content cell (main headline area)
  // This includes in order:
  // - logo (picture in .row.fDD71ED)
  // - headline (picture in .row.b56655F)
  // - hero image (picture in .row.e7AFD3F)
  // - text (p) and CTA buttons (a) from .row.m1D2BFA
  const contentCell = [];

  // logo
  const logoRow = element.querySelector('.row.fDD71ED');
  if (logoRow) {
    const logoPicture = logoRow.querySelector('picture');
    if (logoPicture) contentCell.push(logoPicture);
  }
  // headline
  const headlineRow = element.querySelector('.row.b56655F');
  if (headlineRow) {
    const headlinePicture = headlineRow.querySelector('picture');
    if (headlinePicture) contentCell.push(headlinePicture);
  }
  // hero (the big phone)
  const heroRow = element.querySelector('.row.e7AFD3F');
  if (heroRow) {
    const heroPicture = heroRow.querySelector('picture');
    if (heroPicture) contentCell.push(heroPicture);
  }
  // CTAs and subheading, all in .row.m1D2BFA > .column
  const ctaRow = element.querySelector('.row.m1D2BFA');
  if (ctaRow) {
    const ctaCol = ctaRow.querySelector('.column');
    if (ctaCol) {
      // Add all non-empty elements (e.g. p, a)
      Array.from(ctaCol.children).forEach(child => {
        if (child.tagName === 'DIV' && child.textContent.trim() === '') return;
        contentCell.push(child);
      });
    }
  }

  // Ensure at least one element is present in contentCell (should always be the case)

  const tableRows = [
    ['Hero (hero3)'],
    [backgroundPicture ? backgroundPicture : ''],
    [contentCell]
  ];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
