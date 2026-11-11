/*
  Phone check (plans/mobile.md): opens pages at phone size against a running
  dev server and reports, per page, its height, any sideways overflow, and
  every control whose real hit area is under 24×24px (WCAG 2.2, 2.5.8).

  The hit area is probed with elementFromPoint from the control's centre
  outwards, so invisible hit areas (the `tap` utility) count and anything
  covering the control doesn't. Uses the dev-only capture routes and sample
  data, never a signed-in account.

    node scripts/mobile-check.mts [base-url] [--list] [--only=name,name]
    (default base-url http://localhost:3001; needs Google Chrome)
*/
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith('http')) ?? 'http://localhost:3001';
const list = args.includes('--list');
const only = args.find((a) => a.startsWith('--only='))?.slice(7).split(',');

const PAGES: Record<string, string> = {
  landing: '/',
  login: '/login',
  signup: '/signup',
  'vampire-home': '/capture/vampire/overview',
  'werewolf-home': '/capture/werewolf/overview',
  'hunter-home': '/capture/hunter/overview',
  guided: '/capture/vampire/guided',
  classic: '/capture/vampire/classic',
  'classic-werewolf': '/capture/werewolf/classic',
  'classic-hunter': '/capture/hunter/classic',
  dice: '/capture/vampire/dice',
  sheet: '/capture/werewolf/sheet',
  play: '/capture/vampire/play',
  'play-hunter': '/capture/hunter/play',
  loresheet: '/capture/vampire/lore',
  neutral: '/lab/neutral',
};

const MIN = 24;

type Small = { name: string; w: number; h: number };

const browser = await chromium.launch({ channel: 'chrome' });
for (let [name, path] of Object.entries(PAGES)) {
  if (only && !only.includes(name)) continue;
  path ||= '/';
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto(base + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const measure = () => page.evaluate(async (MIN) => {
    const controls = [...document.querySelectorAll<HTMLElement>('button, a[href], input:not([type=hidden]), select, textarea, [role=button], [role=tab], summary')].filter((el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && !el.closest('.sr-only, [inert]');
    });
    // A checkbox or radio hidden inside its label is hit through the label.
    const owner = (el: HTMLElement) => (el instanceof HTMLInputElement && el.labels?.[0] && el.labels[0].contains(el) ? el.labels[0] : el);
    const small: Small[] = [];
    for (const el of controls) {
      const target = owner(el);
      target.scrollIntoView({ block: 'center', inline: 'center' });
      await new Promise(requestAnimationFrame);
      const r = target.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const hits = (x: number, y: number) => {
        const at = document.elementFromPoint(x, y);
        return !!at && (at === target || target.contains(at));
      };
      if (!hits(cx, cy)) continue; // covered: not a target at this moment
      const reach = (dx: number, dy: number) => {
        let d = 0;
        while (d < 40 && hits(cx + dx * (d + 1), cy + dy * (d + 1))) d++;
        return d;
      };
      const w = reach(-1, 0) + reach(1, 0) + 1;
      const h = reach(0, -1) + reach(0, 1) + 1;
      if (w < MIN || h < MIN) {
        const label = el.getAttribute('aria-label') || el.textContent?.trim().slice(0, 30) || el.getAttribute('name') || el.tagName.toLowerCase();
        small.push({ name: `${el.tagName.toLowerCase()} "${label}"`, w, h });
      }
    }
    return {
      height: document.documentElement.scrollHeight,
      overflow: document.documentElement.scrollWidth - innerWidth,
      controls: controls.length,
      small,
    };
  }, MIN);
  // Pages split into sections on phones (sheets, play mode): measure every section.
  const tabs = page.locator('nav[aria-label="Sheet sections"] a:visible');
  const count = await tabs.count();
  const report = await measure();
  for (let i = 1; i < count; i++) {
    await tabs.nth(i).evaluate((a) => (a as HTMLElement).click());
    await page.waitForTimeout(400);
    const more = await measure();
    report.height = Math.max(report.height, more.height);
    report.overflow = Math.max(report.overflow, more.overflow);
    report.controls += more.controls;
    report.small.push(...more.small);
  }
  if (count > 1) name += ` (${count} sections)`;
  console.log(`${name.padEnd(28)} height ${String(report.height).padStart(6)}  overflow ${report.overflow}  controls ${String(report.controls).padStart(4)}  under ${MIN}px: ${report.small.length}`);
  if (list) {
    const grouped = new Map<string, number>();
    for (const s of report.small) {
      const key = `${s.name} ${s.w}×${s.h}`;
      grouped.set(key, (grouped.get(key) ?? 0) + 1);
    }
    for (const [key, n] of grouped) console.log(`    ${n > 1 ? `${n}× ` : ''}${key}`);
  }
  await context.close();
}
await browser.close();
