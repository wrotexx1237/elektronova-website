const fs = require('fs');

const BASE_URL = "https://elektronova.online";

const STATIC_PAGES = [
    "/", "/en", "/sq/sherbimet", "/en/services",
    "/sq/blogu", "/en/blog", "/sq/kontakt", "/en/contact"
];

const SERVICES_SQ = [
    "/sq/sherbimet/instalimi-kamerave-sigurise", "/sq/sherbimet/sistemet-dahua-cctv",
    "/sq/sherbimet/sistemet-alarmit", "/sq/sherbimet/instalime-elektrike",
    "/sq/sherbimet/riparime-elektrike", "/sq/sherbimet/nderrim-instalimi-elektrik",
    "/sq/sherbimet/instalim-ndricimi", "/sq/sherbimet/panele-elektrike",
    "/sq/sherbimet/mirembajtje-elektrike-biznes", "/sq/sherbimet/elektricist-urgjent",
    "/sq/sherbimet/smart-home-automatizimi"
];

const SERVICES_EN = [
    "/en/services/security-camera-installation", "/en/services/dahua-cctv-systems",
    "/en/services/alarm-systems", "/en/services/electrical-installations",
    "/en/services/electrical-repairs", "/en/services/electrical-rewiring",
    "/en/services/lighting-installation", "/en/services/electrical-panels",
    "/en/services/electrical-maintenance-business", "/en/services/emergency-electrician-24h",
    "/en/services/smart-home-automation"
];

const LOCATION_SLUGS = [
    "peje", "prishtine", "prizren", "gjakove", "gjilan", "ferizaj", 
    "mitrovice", "vushtrri", "podujeve", "suhareke", "rahovec", 
    "lipjan", "kamenice", "decan", "istog", "malisheve", "skenderaj", 
    "gracanice", "kline", "shtime", "obiliq", "drenas", "fushe-kosove", 
    "junik", "hani-i-elezit"
];

const LOCATIONS_SQ = LOCATION_SLUGS.map(slug => `/sq/elektricist-${slug}`);
const LOCATIONS_EN = LOCATION_SLUGS.map(slug => `/en/electrician-${slug}`);

const BLOG_SQ = [
    "kamerat-me-te-mira-per-shtepi", "kamera-sigurie-kosove-udhezues-2026",
    "dahua-vs-hikvision", "rendesia-e-alarmit-wireless",
    "sa-kushton-instalimi-i-kamerave-te-sigurise-ne-kosove", "5-gabime-kamera-sigurie",
    "pse-ndalet-rryma", "sa-kushton-instalimi-elektrik-ne-kosove",
    "5-shenja-nderrim-instalimi-elektrik", "instalimi-i-ndricimit-estetika-dhe-eficienca",
    "panelet-elektrike-modernizimi", "mirembajtja-elektrike-per-biznese",
    "siguria-elektrike-per-femije", "energjia-solare-elektrike",
    "elektricist-urgjent", "smart-home-kosove"
].map(slug => `/sq/blogu/${slug}`);

const BLOG_EN = [
    "best-home-security-cameras-2025", "dahua-vs-hikvision",
    "importance-of-wireless-alarms", "security-cameras-kosovo-guide-2026",
    "security-camera-installation-cost-kosovo", "5-common-security-camera-mistakes",
    "why-does-the-power-trip", "electrical-installation-cost-kosovo",
    "5-signs-house-needs-rewiring", "lighting-installation-guide",
    "electrical-panels-modernization", "business-electrical-maintenance",
    "child-electrical-safety", "solar-energy-kosovo-guide",
    "emergency-electrician-guide", "smart-home-kosovo-guide"
].map(slug => `/en/blog/${slug}`);

const ALL_URLS = [...STATIC_PAGES, ...SERVICES_SQ, ...SERVICES_EN, ...LOCATIONS_SQ, ...LOCATIONS_EN, ...BLOG_SQ, ...BLOG_EN];

async function checkUrl(path) {
    const url = `${BASE_URL}${path}`;
    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
        const text = await response.text();
        const hasContent = text.includes("ElektroNova");
        return { status: response.status, hasContent, message: hasContent ? "" : "Missing keyword 'ElektroNova'" };
    } catch (error) {
        return { status: null, hasContent: false, message: error.message };
    }
}

async function run() {
    console.log(`Checking ${ALL_URLS.length} URLs on ${BASE_URL}...\n`);
    const allResults = [];
    const broken = [];

    for (const path of ALL_URLS) {
        const result = await checkUrl(path);
        const ok = result.status === 200 && result.hasContent;
        const entry = { path, ...result, ok };
        allResults.push(entry);
        if (!ok) broken.push(path);
        console.log(`${ok ? '[OK]' : '[FAIL]'} ${path} (${result.status})`);
    }

    fs.writeFileSync('verification_results.json', JSON.stringify({
        total: ALL_URLS.length,
        working: ALL_URLS.length - broken.length,
        broken_count: broken.length,
        broken_links: broken.map(b => `${BASE_URL}${b}`),
        all_results: allResults
    }, null, 2));

    console.log(`\nVerification Complete. Results written to verification_results.json`);
    console.log(`Total: ${ALL_URLS.length}`);
    console.log(`Working: ${ALL_URLS.length - broken.length}`);
    console.log(`Broken: ${broken.length}`);
}

run();
