import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, resolve } from "node:path";

const [, , inputArg, outputArg, bookArg] = process.argv;
if (!inputArg || !outputArg) {
	console.error("Usage: npm run content:intake -- <source.txt|source.md> <content-dir> [book-id]");
	process.exit(1);
}

const input = resolve(inputArg);
const output = resolve(outputArg);
const bookId = bookArg ?? basename(input, extname(input)).toLowerCase().replace(/[^a-z0-9]+/g, "-");
const raw = readFileSync(input, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");

function normalize(text) {
	return text.replace(/[ \t]+/g, " ").replace(/\n+/g, " ").trim();
}

const blocks = raw.split(/\n\s*\n/).map(normalize).filter(Boolean);
const segments = blocks.map((text, index) => ({
	id: `${bookId}.import.${String(index + 1).padStart(3, "0")}`,
	text,
	chapter: "导入文本",
	sequence: index + 1,
	rawRef: `normalized-source.txt#L${index + 1}`,
}));
mkdirSync(`${output}/sources`, { recursive: true });
mkdirSync(`${output}/sources/raw`, { recursive: true });
mkdirSync(`${output}/canon`, { recursive: true });
writeFileSync(`${output}/manifest.json`, `${JSON.stringify({ id: bookId, title: basename(input, extname(input)), language: "zh-CN", version: "0.1.0", license: "needs-review", defaultRenderer: "dom" }, null, 2)}\n`);
writeFileSync(`${output}/sources/segments.jsonl`, `${segments.map((segment) => JSON.stringify(segment)).join("\n")}\n`);
writeFileSync(`${output}/sources/raw/normalized-source.txt`, `${blocks.join("\n")}\n`);
writeFileSync(`${output}/sources/extraction-report.json`, `${JSON.stringify({ input, method: extname(input).toLowerCase() === ".md" ? "markdown-blocks" : "text-paragraphs", normalizedSegments: segments.length, warnings: ["请人工确认版本、版权、分段和 OCR 风险。"], status: "needs-review" }, null, 2)}\n`);
writeFileSync(`${output}/canon/claims.jsonl`, "");
console.log(`Source intake complete: ${segments.length} segments written to ${output}`);
