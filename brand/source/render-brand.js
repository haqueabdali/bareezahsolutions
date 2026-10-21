// Renders the Bareezah Solutions brand kit: logos, Facebook, Instagram and the A4 letterhead.
// Usage: node render-brand.js <outDir>
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = process.argv[2];
const HERE = __dirname;
// Letterhead contact details: replace with the real ones and re-run.
const CONTACT = {
  address: 'অফিসের ঠিকানা এখানে, বাংলাদেশ',
  phone: '+880 1XXX-XXXXXX',
  email: 'info@bareezahsolutions.com'
};

const MARK = (field, ink, dot) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="${field}"/><path d="M33 23V77M33 23H53.5a13.5 13.5 0 0 1 0 27H33M33 50H57.5a13.5 13.5 0 0 1 0 27H33" fill="none" stroke="${ink}" stroke-width="9.5" stroke-linecap="round" stroke-linejoin="round"/>${dot ? `<circle cx="80" cy="23" r="6" fill="${dot}"/>` : ''}</svg>\n`;

(async () => {
  for (const d of ['logo', 'facebook', 'instagram', 'letterhead']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
  fs.writeFileSync(path.join(OUT, 'logo/bareezah-mark.svg'), MARK('#0f5a3f', '#f4e8cf', '#dcaa52'));
  fs.writeFileSync(path.join(OUT, 'logo/bareezah-mark-reverse.svg'), MARK('#f4e8cf', '#0e3a2a', '#b8862b'));
  fs.writeFileSync(path.join(OUT, 'logo/bareezah-mark-mono.svg'), MARK('#000000', '#ffffff', '#ffffff'));

  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(HERE, 'brand.html'));
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);

  const shots = [
    ['#logo-light', 'logo/bareezah-logo-horizontal.png', true],
    ['#logo-dark', 'logo/bareezah-logo-horizontal-on-green.png', false],
    ['#mark-only', 'logo/bareezah-mark-1024.png', true],
    ['#fb-profile', 'facebook/facebook-profile-2048.png', false],
    ['#fb-cover', 'facebook/facebook-cover-1640x624.png', false],
    ['#ig-profile', 'instagram/instagram-profile-1080.png', false]
  ];
  for (const [sel, file, transparent] of shots) {
    await page.locator(sel).screenshot({ path: path.join(OUT, file), omitBackground: transparent });
  }

  // Letterhead: PDF for print, PNG preview, plus header/footer strips for the Word template
  let html = fs.readFileSync(path.join(HERE, 'letterhead.html'), 'utf8')
    .replace('ADDRESS_LINE', CONTACT.address).replace('PHONE_LINE', CONTACT.phone).replace('EMAIL_LINE', CONTACT.email);
  const lhFile = path.join(HERE, 'letterhead.rendered.html');
  fs.writeFileSync(lhFile, html);
  const lh = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 3 });
  await lh.goto('file://' + lhFile);
  await lh.waitForLoadState('networkidle');
  await lh.evaluate(() => document.fonts.ready);
  await lh.pdf({ path: path.join(OUT, 'letterhead/bareezah-letterhead-A4.pdf'), format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await lh.locator('#page').screenshot({ path: path.join(OUT, 'letterhead/bareezah-letterhead-A4.png') });

  // Strips for Word: the header area (top to just under the ref line) and the footer
  const box = await lh.evaluate(() => {
    const mm = 96 / 25.4;
    const foot = document.getElementById('lh-foot').getBoundingClientRect();
    return { headH: 50 * mm, footY: foot.top, footH: foot.height, w: document.getElementById('page').getBoundingClientRect().width };
  });
  await lh.evaluate(() => { document.querySelector('.refs').style.display = 'none'; document.querySelector('.watermark').style.display = 'none'; });
  await lh.screenshot({ path: path.join(HERE, 'lh-header.png'), clip: { x: 0, y: 0, width: box.w, height: box.headH } });
  await lh.screenshot({ path: path.join(HERE, 'lh-footer.png'), clip: { x: 0, y: box.footY, width: box.w, height: box.footH } });
  fs.writeFileSync(path.join(HERE, 'lh-dims.json'), JSON.stringify({ headMm: 50, footMm: box.footH * 25.4 / 96 }));
  await browser.close();
  console.log('rendered to', OUT);
})();
