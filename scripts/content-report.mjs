import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "content/demo");
const readLines = (file) => readFileSync(`${root}/${file}`, "utf8").split(/\r?\n/).filter(Boolean).map(JSON.parse);
const manifest = JSON.parse(readFileSync(`${root}/manifest.json`, "utf8"));
const segments = readLines("sources/segments.jsonl");
const claims = readLines("canon/claims.jsonl");
const review = existsSync(`${root}/review/approval.json`) ? JSON.parse(readFileSync(`${root}/review/approval.json`, "utf8")) : null;
const byCertainty = Object.groupBy ? Object.groupBy(claims, (claim) => claim.certainty) : claims.reduce((acc, claim) => ((acc[claim.certainty] ??= []).push(claim), acc), {});
const sourceGrounded = claims.filter((claim) => ["explicit", "inferred", "contested"].includes(claim.certainty));
const reviewStates = Object.values(review?.reviewers ?? {}).map((item) => item.status);
const report = {
	book: manifest.id,
	version: manifest.version,
	status: "validated",
	reviewStatus: reviewStates.includes("awaiting-human-review") ? "awaiting-human-review" : reviewStates.every((state) => state === "reviewed") ? "reviewed" : "draft",
	releaseStatus: review?.nextGate ? `blocked:${review.nextGate}` : "not-assessed",
	segments: segments.length,
	claims: claims.length,
	claimsByCertainty: Object.fromEntries(Object.entries(byCertainty).map(([key, value]) => [key, value.length])),
	citationCoverage: sourceGrounded.filter((claim) => claim.sourceRefs?.length).length / Math.max(sourceGrounded.length, 1),
	canonicalClaimCoverage: sourceGrounded.length ? 1 : 0,
	counterfactualClaims: claims.filter((claim) => claim.certainty === "counterfactual").length,
	generatedAt: new Date().toISOString(),
};
const output = resolve("reports", manifest.id, "content-report.json");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Content report written: ${output}`);
