/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get first descendant picture/img for background image
  function getBackgroundImage() {
    // Background image is in .q540661 (usually a picture)
    const bg = element.querySelector('.q540661 picture, .q540661 img');
    return bg || null;
  }

  // Helper: get foreground/hero device image
  function getForegroundHeroImage() {
    // Hero device image is in .e7AFD3F
    const fg = element.querySelector('.e7AFD3F picture, .e7AFD3F img');
    return fg || null;
  }

  // Helper: get logo/title image (likely in h2 > picture)
  function getLogoHeading() {
    const logo = element.querySelector('.fDD71ED h2');
    return logo || null;
  }

  // Helper: get headline image (usually in .b56655F)
  function getHeadlineImage() {
    const headline = element.querySelector('.b56655F picture, .b56655F img');
    return headline || null;
  }

  // Helper: get cta row content (paragraph and links)
  function getCtaBlock() {
    const ctaRow = element.querySelector('.m1D2BFA');
    if (!ctaRow) return null;
    // Get the paragraph
    const p = ctaRow.querySelector('p');
    // Get all CTA links
    const links = Array.from(ctaRow.querySelectorAll('a'));
    // Push only if exists
    const contents = [];
    if (p) contents.push(p);
    if (links.length) contents.push(...links);
    return contents.length ? contents : null;
  }

  // Compose background cell (2nd row)
  const backgroundImg = getBackgroundImage();
  // Cell should be empty string if not present
  const backgroundCell = backgroundImg ? [backgroundImg] : '';

  // Compose content cell (3rd row): logo/title, headline, hero, cta
  const contentCell = [];
  const logo = getLogoHeading();
  if (logo) contentCell.push(logo);
  const headline = getHeadlineImage();
  if (headline) contentCell.push(headline);
  const foregroundHero = getForegroundHeroImage();
  if (foregroundHero) contentCell.push(foregroundHero);
  const ctaBlock = getCtaBlock();
  if (ctaBlock) contentCell.push(...ctaBlock);

  // Compose the table structure
  const cells = [
    ['Hero (hero3)'],
    [backgroundCell],
    [contentCell.length ? contentCell : ''],
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
