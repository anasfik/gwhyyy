// Run with the Playwright MCP browser_run_code_unsafe filename option.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
async (page) => {
  const assert = (value, message) => { if (!value) throw new Error(message); };
  const base = "http://127.0.0.1:4318";
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto(base);
  const colors = () => page.evaluate(() => ({
    background: getComputedStyle(document.body).backgroundColor,
    foreground: getComputedStyle(document.body).color,
    scheme: getComputedStyle(document.documentElement).colorScheme,
  }));
  const dark = await colors();
  assert(dark.background === "rgb(18, 22, 17)", "System dark background missing");
  assert(dark.scheme.includes("dark"), "Native controls do not support dark mode");
  await page.emulateMedia({ colorScheme: "light" });
  await page.waitForFunction(() => getComputedStyle(document.body).backgroundColor === "rgb(243, 244, 238)");
  const light = await colors();
  assert(light.background === "rgb(243, 244, 238)", "System light background missing");
  assert(light.foreground !== dark.foreground, "Text did not adapt with the system");
  for (const path of ["/about", "/work", "/work/reqistry", "/services", "/services/ai-engineering", "/contact", "/resume", "/privacy", "/login", "/not-a-real-page"]) {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto(`${base}${path}`);
    assert((await colors()).background === dark.background, `Dark surface missing on ${path}`);
    assert(await page.locator("a").filter({ hasText: /^Discuss your project$/ }).count() === 0, `Old CTA on ${path}`);
  }
  // CSS alone must select the right first paint, even when JavaScript is disabled.
  const context = await page.context().browser().newContext({ javaScriptEnabled: false, colorScheme: "dark" });
  const staticPage = await context.newPage();
  await staticPage.goto(base);
  assert(await staticPage.evaluate(() => getComputedStyle(document.body).backgroundColor) === dark.background, "Dark mode needs JavaScript");
  await context.close();
  return { pass: true, dark, light, routes: 10, noJavaScript: true };
}
