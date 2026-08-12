import { readdirSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const assets = readdirSync("dist/web/assets").filter((file) => /\.(js|css)$/.test(file));
const limits = { ".js": 160 * 1024, ".css": 12 * 1024 };
const errors = [];
for (const asset of assets) {
	const ext = asset.endsWith(".js") ? ".js" : ".css";
	const size = gzipSync(readFileSync(`dist/web/assets/${asset}`)).byteLength;
	if (size > limits[ext]) errors.push(`${asset}: ${size} exceeds gzip budget ${limits[ext]}`);
}
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`Build budget passed: ${assets.length} web assets within gzip budgets`);
