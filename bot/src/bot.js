// Force puppeteer to store everything to /tmp/
process.env.HOME = "/tmp";

const { delay, handleTargetCreated, handleTargetDestroyed, logMainInfo, logMainError } = require("./utils");
const puppeteer = require("puppeteer");

// Banner
const tips = ["Every console.log usage on the bot will be sent back to you :)", "There is a small race window (~10ms) when a new tab is opened where console.log won't return output :("];
console.log(`==========\nTips: ${tips[Math.floor(Math.random() * tips.length)]}\n==========`);

// Spawn the bot and navigate to the user provided link.
async function goto(url) {
	logMainInfo("Starting the browser...");
	const browser = await puppeteer.launch({
		headless: "new",
		ignoreHTTPSErrors: true,
		args: [
			"--no-sandbox",
			"--disable-gpu",
			"--disable-jit",
			"--disable-wasm",
			"--disable-dev-shm-usage",
			//`--proxy-pac-url=data:application/x-ns-proxy-autoconfig;base64,${PAC_B64}`, this being commented isn't part of the challenge :)
		],
		executablePath: "/usr/bin/chromium-browser"
	});

	// Hook tabs events
	browser.on("targetcreated", handleTargetCreated.bind(browser));
	browser.on("targetdestroyed", handleTargetDestroyed.bind(browser));

	/* ** CHALLENGE LOGIC ** */
	const [page] = await browser.pages(); // Reuse the page created by the browser.
	await handleTargetCreated(page.target()); // Since it was created before the event listener was set, we need to hook it up manually.
	await page.setDefaultNavigationTimeout(5000);
	await page.setCookie({
		name: 'FLAG',
		value: 'VDT{FLAG_FOR_TESTING}',
		domain: 'localhost', // must match current URL
  });
	logMainInfo("Going to the user provided link...: "+url);
	try { await page.goto(url) } catch {}
	await delay(5000);

	logMainInfo("Leaving o/");
	await browser.close();
	return;
}

module.exports = {
	goto
}