// Run with the Playwright MCP browser_run_code_unsafe filename option.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
async (page) => {
  const assert = (value, message) => { if (!value) throw new Error(message); };
  const base = "http://127.0.0.1:4318";
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base);
  assert(await page.locator("h1").innerText() === "AI-supercharged engineer who actually ships.", "New hero copy missing");
  const carousel = page.getByRole("region", { name: "Project showcase", exact: true });
  assert(await carousel.count() === 1, "Project showcase missing");
  const initial = await carousel.getAttribute("data-active-project");
  await page.waitForFunction(slug => document.querySelector('[aria-label="Project showcase"]').dataset.activeProject !== slug, initial, { timeout: 8500 });
  await carousel.getByRole("button", { name: "Pause showcase" }).click();
  const paused = await carousel.getAttribute("data-active-project");
  await carousel.getByRole("button", { name: "Next project", exact: true }).focus();
  await page.keyboard.press("Enter");
  assert(await carousel.getAttribute("data-active-project") !== paused, "Keyboard next control failed");
  await carousel.getByRole("button", { name: "Previous project", exact: true }).click();
  assert(await carousel.getAttribute("data-active-project") === paused, "Previous control failed");
  const seen = new Set();
  for (let i = 0; i < 6; i++) {
    seen.add(await carousel.getAttribute("data-active-project"));
    assert(await carousel.locator("a:not([inert] a)").count() >= 1, "Case study link missing");
    await carousel.getByRole("button", { name: "Next project", exact: true }).click();
  }
  assert(seen.size === 6, "Carousel does not include all six projects");
  assert(await page.locator('header a[href="https://github.com/anasfik"][target="_blank"]').count() >= 1, "External GitHub navigation missing");
  assert(await page.locator("#about-title").count() === 0, "Homepage biography was not removed");
  assert(await page.getByText("Verified public metrics", { exact: true }).count() === 0, "Old metrics remain");
  const belt = page.getByRole("region", { name: "Projects and teams", exact: true });
  await belt.getByRole("button", { name: "Pause logo strip" }).click();
  await belt.locator(".brand-scroll").evaluate(el => { el.scrollLeft = 300; el.dispatchEvent(new Event("scroll")); });
  const focus = await belt.locator(".brand-item").evaluateAll(items => items.map(el => Number(el.style.getPropertyValue("--focus"))));
  assert(focus.some(value => value > 0.2) && focus.some(value => value === 0), "Center color focus is not localized");
  for (const width of [1440, 1024, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Page overflows at ${width}px`);
  }
  await page.getByRole("button", { name: "Open navigation" }).click();
  const mobileMenu = page.locator("#mobile-navigation");
  assert(await mobileMenu.getByRole("link", { name: /GitHub/ }).count() === 1, "Mobile GitHub link missing");
  await page.keyboard.press("Escape");
  assert(await mobileMenu.count() === 0, "Escape did not close mobile navigation");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  assert(await page.getByRole("button", { name: "Play showcase" }).count() === 1, "Reduced motion did not stop showcase");
  assert(await page.getByRole("button", { name: "Play logo strip" }).count() === 1, "Reduced motion did not stop logo strip");
  assert(await page.locator('a').filter({ hasText: /^Discuss your project$/ }).count() === 0, "Old contact CTA remains");
  assert(errors.length === 0, `Browser errors: ${errors.join("; ")}`);
  return { pass: true, projects: [...seen], widths: [1440, 1024, 768, 390], browserErrors: errors };
}
