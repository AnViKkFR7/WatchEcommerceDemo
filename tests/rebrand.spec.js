import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { MOCK_WATCHES } from '../src/lib/mockWatches.js';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/watches', route => route.fulfill({ json: MOCK_WATCHES }));
  await page.route('**/api/company', route => route.fulfill({ json: { name: 'TimeCraft', contact_phone: '+34612345678' } }));
  await page.route('https://images.unsplash.com/**', route => route.fulfill({ path: 'src/assets/omega-detail.webp', contentType: 'image/webp' }));
});

test('routes retain content, fit the viewport and pass accessibility checks', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const path of ['/', '/tienda', '/reloj/mock-1', '/sobre-nosotros', '/missing-page']) {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([]);
    await page.screenshot({ path: '.cache/rebrand/' + info.project.name + '-' + (path.replaceAll('/','-') || 'home') + '.png' });
  }
});

test('catalog preserves every filter, URL state, order and reset', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Filter combinations run once; drawers have separate coverage.');
  await page.goto('/tienda');
  const cards = page.locator('.watch-card');
  await expect(cards).toHaveCount(MOCK_WATCHES.length);
  await page.locator('#d-brand').selectOption('Rolex');
  await expect(cards).toHaveCount(MOCK_WATCHES.filter(w => w.attrs.brand === 'Rolex').length);
  await expect(page).toHaveURL(/brand=Rolex/);
  await page.reload();
  await expect(page.locator('#d-brand')).toHaveValue('Rolex');
  await page.locator('.catalog-sidebar .filter-clear').click();
  await page.locator('#d-query').fill('126610LN');
  await expect(cards).toHaveCount(1);
  await page.locator('.catalog-sidebar .filter-clear').click();
  await page.locator('.catalog-sidebar input[placeholder="Mín."]').fill('1000');
  await page.locator('.catalog-sidebar input[placeholder="Máx."]').fill('6000');
  await expect(cards).toHaveCount(MOCK_WATCHES.filter(w => w.attrs.price >= 1000 && w.attrs.price <= 6000).length);
  for (const [id, attr] of [['dial','dial_color'], ['bracelet','bracelet_material']]) {
    await page.locator('.catalog-sidebar .filter-clear').click();
    const value = JSON.stringify(MOCK_WATCHES[0].attrs[attr]);
    await page.locator('#d-' + id).selectOption(value);
    await expect(cards).toHaveCount(MOCK_WATCHES.filter(w => JSON.stringify(w.attrs[attr]) === value).length);
  }
  await page.locator('.catalog-sidebar .filter-clear').click();
  await page.locator('.catalog-sidebar').getByLabel('Nuevo', { exact: true }).check();
  await expect(cards).toHaveCount(MOCK_WATCHES.filter(w => w.attrs.condition.en.toLowerCase().includes('new')).length);
  await page.locator('.catalog-sidebar').getByLabel('Usado / Vintage').check();
  await expect(cards).toHaveCount(MOCK_WATCHES.filter(w => !w.attrs.condition.en.toLowerCase().includes('new')).length);
  await page.locator('.catalog-sidebar .filter-clear').click();
  await page.locator('#sort').selectOption('priceAsc');
  const sorted = [...MOCK_WATCHES].sort((a,b) => a.attrs.price - b.attrs.price);
  await expect(cards.first()).toHaveAttribute('href', '/reloj/' + sorted[0].id);
  await page.locator('#sort').selectOption('priceDesc');
  await expect(cards.first()).toHaveAttribute('href', '/reloj/' + sorted.at(-1).id);
  await page.locator('#d-query').fill('no-match-zzzz');
  await expect(page.locator('.catalog-empty')).toBeVisible();
  await page.getByRole('button', { name: 'Quitar filtros' }).click();
  await expect(cards).toHaveCount(MOCK_WATCHES.length);
  await page.goto('/tienda?featured=1');
  await expect(cards).toHaveCount(MOCK_WATCHES.filter(w => w.attrs.is_featured).length);
});

test('mobile menu and filters confine focus and close with Escape', async ({ page }, info) => {
  test.skip(info.project.name === 'desktop' || info.project.name === 'tablet-wide', 'Desktop has visible navigation and filters.');
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menú' });
  await menu.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(menu).toBeFocused();
  await menu.click();
  await page.getByRole('dialog').getByRole('link', { name: 'Tienda', exact: true }).click();
  await page.getByRole('button', { name: 'Filtros', exact: true }).click();
  const drawer = page.getByRole('dialog');
  await drawer.locator('#m-brand').selectOption('Rolex');
  for (let i = 0; i < 18; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement.closest('dialog'))).toBe(true);
  }
  await drawer.getByRole('button', { name: /Ver \d+ relojes/ }).click();
  await expect(drawer).not.toBeVisible();
  await expect(page.locator('.watch-card')).toHaveCount(MOCK_WATCHES.filter(w => w.attrs.brand === 'Rolex').length);
});

test('product contact, zoom, FAQ and English content remain usable', async ({ page }, info) => {
  await page.goto('/reloj/mock-1');
  const contact = page.locator('.product-cta-panel a');
  await expect(contact).toHaveAttribute('href', /wa.me\/34612345678/);
  const url = new URL(await contact.getAttribute('href'));
  expect(url.searchParams.get('text')).toContain('126610LN');
  expect(url.searchParams.get('text')).toContain('/reloj/mock-1');
  await page.locator('.image-zoom').click();
  await expect(page.locator('.image-zoom')).toHaveAttribute('aria-pressed','true');
  await page.keyboard.press('Escape');
  await expect(page.locator('.image-zoom')).toHaveAttribute('aria-pressed','false');
  await page.goto('/sobre-nosotros#faq');
  await page.getByRole('button', { name: /Cómo puedo comprar/ }).click();
  await expect(page.locator('.faq-answer').first()).toBeVisible();
  if (info.project.name === 'mobile' || info.project.name === 'tablet') {
    await page.getByRole('button', { name: 'Menú' }).click();
    await page.locator('.lang-switcher-mobile .lang-switcher-trigger').click();
    await page.locator('.lang-switcher-mobile').getByRole('button', { name: 'EN English' }).click();
  } else {
    await page.locator('.lang-switcher-desktop .lang-switcher-trigger').click();
    await page.locator('.lang-switcher-desktop').getByRole('button', { name: 'EN English' }).click();
  }
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.locator('h1')).toContainText('2016');
  await page.goto('/tienda');
  await expect(page.locator('h1')).toHaveText('Shop');
});

test('reduced motion leaves revealed content visible and static', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('#featured').scrollIntoViewIfNeeded();
  const state = await page.locator('#featured .watch-grid > div > div').first().evaluate(el => {
    const s = getComputedStyle(el); return { opacity: s.opacity, transform: s.transform, animation: s.animationName };
  });
  expect(state).toEqual({opacity:'1',transform:'none',animation:'none'});
  await expect(page.locator('.hero-title')).toHaveCSS('opacity','1');
});


test('brand links filter with one activation and support keyboard navigation', async ({ page }) => {
  await page.goto('/');
  const brands = page.getByRole('navigation', { name: 'Compra por marca' });
  await expect(brands.getByRole('link')).toHaveCount(8);
  const omega = brands.getByRole('link', { name: 'Omega', exact: true });
  await expect(omega).toHaveAttribute('href', '/tienda?brand=Omega');
  await omega.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/brand=Omega/);
  await expect(page.locator('.watch-card')).toHaveCount(MOCK_WATCHES.filter(w => w.attrs.brand === 'Omega').length);
  await page.goto('/');
  await brands.getByRole('link', { name: 'Rolex', exact: true }).click();
  await expect(page).toHaveURL(/brand=Rolex/);
  await expect(page.locator('.watch-card')).toHaveCount(MOCK_WATCHES.filter(w => w.attrs.brand === 'Rolex').length);
});
