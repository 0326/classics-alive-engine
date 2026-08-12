import { readFileSync } from "node:fs";

const files = ["README.md", "AGENTS.md", "docs/technical-plan.md", "docs/development-plan.md", "docs/verification-report.md", "skills/build-classics-alive-game/SKILL.md"];
const errors = [];
for (const file of files) {
	const text = readFileSync(file, "utf8");
	if (text.includes("TODO") || text.includes("[TODO")) errors.push(`${file}: contains TODO placeholder`);
	if (!text.endsWith("\n")) errors.push(`${file}: missing final newline`);
}
if (errors.length) {
	console.error(errors.join("\n"));
	process.exit(1);
}
console.log(`Documentation check passed: ${files.length} files`);
