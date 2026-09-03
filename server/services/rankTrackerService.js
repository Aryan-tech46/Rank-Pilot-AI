import { chromium } from "playwright-core";
import Browserbase from "@browserbasehq/sdk";

const getBrowserbase = () => new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY });

// Search Google for a keyword and extract ranking results for a target domain.
export async function rankTracker(keyword, targetDomain) {
    let browser;
    try {
        // 1. Initialize Browserbase Session & Connect Playwright
        const bb = getBrowserbase();
        const session = await bb.sessions.create({ browserSettings: { blockAds: true } });
        browser = await chromium.connectOverCDP(session.connectUrl);
        const page = browser.contexts()[0].pages()[0];
        page.setDefaultNavigationTimeout(30000);

        let found = null,
            allResults = [];

        const cleanTarget = targetDomain.replace(/^https?:\/\//, "").replace("www.", "").split("/")[0].toLowerCase();

        // 2. Search Loop: Iterate through up to 5 pages of Google results
        for (let gPage = 0; gPage < 5; gPage++) {
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&start=${gPage * 10}&num=10&hl=en&gl=us`;
            try {
                await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
            } catch (navError) {
                console.warn(`[RANK] Navigation error on page ${gPage + 1}:`, navError.message);
            }

            // Consent check (if needed)
            if (gPage === 0) {
                try {
                    const btn = await page.$('button[id="L2AGLb"], form[action*="consent"] button');
                    if (btn) {
                        await btn.click();
                        await page.waitForTimeout(1000);
                    }
                } catch {}
            }

            // 3. Page Extraction: Retry if results are missing
            let pageResults = [];
            for (let retry = 0; retry < 3; retry++) {
                try {
                    await page.waitForSelector("h3", { timeout: 6000 });
                    await page.waitForTimeout(1500);

                    pageResults = await page.evaluate(() => {
                        const items = [];
                        const containers = document.querySelectorAll("div.MjjYud, div.g");

                        containers.forEach((c) => {
                            const h3 = c.querySelector("h3");
                            if (!h3) return;

                            const a = h3.closest("a") || c.querySelector("a[href]");
                            const cite = c.querySelector("cite")?.innerText || "";
                            const rawHref = a?.href || "";

                            let realUrl = "";
                            if (rawHref && !rawHref.includes("google.com/goto") && !rawHref.includes("google.com/url") && !rawHref.includes("google.com/search")) {
                                realUrl = rawHref;
                            } else if (rawHref.includes("/url?q=")) {
                                try {
                                    const u = new URL(rawHref);
                                    realUrl = u.searchParams.get("q") || "";
                                } catch {}
                            }

                            if (!realUrl && cite) {
                                let cleanCite = cite.split(/[\s›>·]/)[0].trim();
                                if (cleanCite && !cleanCite.startsWith("http")) {
                                    cleanCite = "https://" + cleanCite;
                                }
                                realUrl = cleanCite;
                            }

                            if (!realUrl) return;

                            let domain = "";
                            try {
                                domain = new URL(realUrl.startsWith("http") ? realUrl : "https://" + realUrl).hostname.replace("www.", "");
                            } catch {
                                domain = realUrl.replace(/^https?:\/\//, "").split("/")[0].replace("www.", "");
                            }

                            // Filter out internal google services / empty / noise
                            if (!domain || domain.includes("google.") || domain.length < 3 || !domain.includes(".")) return;

                            if (!items.some((i) => i.domain === domain.toLowerCase())) {
                                const snippetEl = c.querySelector("div.VwiC3b") || c.querySelector('div[style*="-webkit-line-clamp"]');
                                let snippet = snippetEl ? snippetEl.innerText.trim() : "";

                                items.push({
                                    title: h3.innerText.trim(),
                                    url: realUrl,
                                    domain: domain.toLowerCase(),
                                    snippet: snippet.substring(0, 300),
                                });
                            }
                        });
                        return items;
                    });

                    if (pageResults.length > 0) break;
                    await page.reload({ waitUntil: "domcontentloaded" });
                } catch (err) {
                    if (retry === 2) break;
                    await page.reload({ waitUntil: "domcontentloaded" });
                }
            }

            if (!pageResults.length) break;

            // 4. Result Synthesis: Update global results and check for target match
            for (const r of pageResults) {
                r.position = allResults.length + 1;
                allResults.push(r);
                if (!found && (r.domain.toLowerCase().includes(cleanTarget) || cleanTarget.includes(r.domain.toLowerCase()))) {
                    found = { ...r, page: gPage + 1 };
                }
            }

            if (found) break;
            await page.waitForTimeout(1000 + Math.random() * 1000);
        }

        // 5. Finalization: Close browser and extract competitors
        await browser.close();
        const competitors = allResults
            .filter((r) => !r.domain.toLowerCase().includes(cleanTarget) && !cleanTarget.includes(r.domain.toLowerCase()))
            .slice(0, 10);

        return {
            success: true,
            data: {
                keyword,
                targetDomain,
                position: found?.position || null,
                page: found?.page || null,
                title: found?.title || "",
                snippet: found?.snippet || "",
                competitors,
                totalResultsScanned: allResults.length,
            },
        };
    } catch (error) {
        console.error("Rank check error:", error.message);
        if (browser) await browser.close().catch(() => {});
        return { success: false, error: error.message };
    }
}
