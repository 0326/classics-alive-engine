import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { Compiler } from "inkjs/full";
import { activeGame } from "./active-game.mjs";

const root = resolve(process.argv[2] ?? activeGame.contentPack);
const errors = [];
const diagnostics = { root: relative(process.cwd(), root) || ".", choices: 0, canonicalChoices: 0, counterfactualChoices: 0, outcomes: 0, citedClaims: 0, assetReferences: 0 };
const read = (file) => readFileSync(join(root, file), "utf8");
const json = (file) => {
	try { return JSON.parse(read(file)); }
	catch (error) { errors.push(`${file}: ${error.message}`); return null; }
};
const jsonl = (file) => {
	try { return read(file).split(/\r?\n/).filter(Boolean).map((line, index) => {
		try { return JSON.parse(line); }
		catch (error) { errors.push(`${file}:${index + 1}: ${error.message}`); return null; }
	}).filter(Boolean); }
	catch (error) { errors.push(`${file}: ${error.message}`); return []; }
};
const tags = (text, name) => [...text.matchAll(new RegExp(`#${name}:([^\\s]+)`, "g"))].map((match) => match[1]);
const normalize = (value) => value.replace(/[\s　]+/g, "").replace(/[，。！？、：“”‘’《》]/g, "");
const manifest = json("manifest.json");
const qualityTargets = json("design/quality-targets.json");
const edition = json("sources/edition.json");
const extraction = json("sources/extraction-report.json");
const assets = json("assets/manifest.json")?.assets ?? [];
const outcomes = json("canon/outcomes.json") ?? { achievements: [], deaths: [] };
const segments = jsonl("sources/segments.jsonl");
const claims = jsonl("canon/claims.jsonl");
const quotes = jsonl("learning/quotes.jsonl");
const reader = json("learning/reader.json")?.segments ?? {};

const range = (value, label, { max = true } = {}) => {
	if (!value || !Number.isInteger(value.min) || (max && !Number.isInteger(value.max)) || (max && value.min > value.max)) {
		errors.push(`design/quality-targets.json: ${label} must declare valid integer min${max ? "/max" : ""}`);
		return null;
	}
	return value;
};
if (qualityTargets?.schemaVersion !== "1.0") errors.push("design/quality-targets.json: schemaVersion 1.0 is required");
const durationTarget = range(qualityTargets?.playability?.durationMinutes, "playability.durationMinutes");
const choiceNodeTarget = range(qualityTargets?.playability?.majorChoiceNodes, "playability.majorChoiceNodes");
const canonicalRouteTarget = range(qualityTargets?.playability?.canonicalRouteChoices, "playability.canonicalRouteChoices");
const endingTarget = range(qualityTargets?.playability?.endings, "playability.endings", { max: false });
const counterfactualTarget = range(qualityTargets?.playability?.counterfactualChoices, "playability.counterfactualChoices", { max: false });
const segmentTarget = range(qualityTargets?.evidence?.sourceSegments, "evidence.sourceSegments", { max: false });
const claimTarget = range(qualityTargets?.evidence?.claims, "evidence.claims", { max: false });
const groundedClaimTarget = range(qualityTargets?.evidence?.sourceGroundedClaims, "evidence.sourceGroundedClaims", { max: false });
if (qualityTargets?.evidence?.canonicalEvidenceCoverage !== 1) errors.push("design/quality-targets.json: evidence.canonicalEvidenceCoverage must be 1");
if (typeof qualityTargets?.playability?.assets?.requireFiles !== "boolean") errors.push("design/quality-targets.json: playability.assets.requireFiles must be boolean");
if (typeof qualityTargets?.release?.requiresHumanHistoricalReview !== "boolean") errors.push("design/quality-targets.json: release.requiresHumanHistoricalReview must be boolean");

if (!manifest?.id || !manifest?.title || !manifest?.version || !manifest?.license) errors.push("manifest: id, title, version, license are required");
if (!edition?.sourceUrl || !edition?.retrievedAt || !edition?.edition || !edition?.status) errors.push("sources/edition.json: edition, sourceUrl, retrievedAt, status are required");
if (!extraction?.method || !extraction?.status) errors.push("sources/extraction-report.json: method and status are required");

const segmentMap = new Map();
for (const segment of segments) {
	if (!segment.id || !segment.text || !segment.chapter || !Number.isInteger(segment.sequence)) errors.push(`invalid segment: ${segment.id ?? "<missing>"}`);
	if (segmentMap.has(segment.id)) errors.push(`duplicate segment: ${segment.id}`);
	segmentMap.set(segment.id, segment);
	if (!segment.rawRef) errors.push(`${segment.id}: rawRef is required`);
}
try {
	const rawSources = new Map();
	for (const segment of segments) {
		const [, rawFile, lineValue] = String(segment.rawRef ?? "").match(/^(.+)#L(\d+)$/) ?? [];
		const line = Number.parseInt(lineValue ?? "0", 10);
		if (!rawFile || !line) { errors.push(`${segment.id}: rawRef must use <raw-file>#L<number>`); continue; }
		if (!rawSources.has(rawFile)) rawSources.set(rawFile, read(`sources/raw/${rawFile}`).split(/\r?\n/));
		const rawLines = rawSources.get(rawFile);
		if (!rawLines?.[line - 1]) errors.push(`${segment.id}: rawRef does not resolve`);
		else if (normalize(segment.text) !== normalize(rawLines[line - 1])) errors.push(`${segment.id}: normalized segment differs from raw source ${rawFile} line ${line}`);
		const readerItem = reader[segment.id];
		if (!readerItem) errors.push(`${segment.id}: missing learning reader entry`);
		else if (normalize(readerItem.original) !== normalize(segment.text)) errors.push(`${segment.id}: reader original differs from source segment`);
	}
} catch (error) { errors.push(`sources/raw: ${error.message}`); }

const certainty = new Set(["explicit", "inferred", "contested", "invented", "counterfactual"]);
const claimMap = new Map();
for (const claim of claims) {
	if (!claim.id || !claim.statement || !certainty.has(claim.certainty)) errors.push(`invalid claim: ${claim.id ?? "<missing>"}`);
	if (claimMap.has(claim.id)) errors.push(`duplicate claim: ${claim.id}`);
	claimMap.set(claim.id, claim);
	for (const ref of claim.sourceRefs ?? []) if (!segmentMap.has(ref)) errors.push(`${claim.id}: missing source ${ref}`);
	if (["explicit", "inferred", "contested"].includes(claim.certainty) && !claim.sourceRefs?.length) errors.push(`${claim.id}: sourced claim requires sourceRefs`);
	if (["invented", "counterfactual"].includes(claim.certainty) && !claim.rationale) errors.push(`${claim.id}: invented/counterfactual claim requires rationale`);
	if (!claim.usages?.length) errors.push(`${claim.id}: claim has no usages`);
}
const sourceGroundedClaims = claims.filter((claim) => ["explicit", "inferred", "contested"].includes(claim.certainty));
for (const quote of quotes) {
	const segment = segmentMap.get(quote.sourceId);
	if (!segment) errors.push(`quote: missing source ${quote.sourceId}`);
	else if (!normalize(segment.text).includes(normalize(quote.quote))) errors.push(`quote: ${quote.sourceId} does not contain quoted text`);
}

const assetIds = new Set();
for (const asset of assets) {
	if (!asset.id || assetIds.has(asset.id)) errors.push(`invalid or duplicate asset: ${asset.id ?? "<missing>"}`);
	assetIds.add(asset.id);
	if (!asset.type || !asset.status || !asset.path || !asset.license || !asset.brief) errors.push(`asset ${asset.id}: type, status, path, license, brief are required`);
	else if (!existsSync(join(root, "assets", asset.path))) errors.push(`asset ${asset.id}: missing file ${asset.path}`);
	if (asset.type === "character" && !asset.alt) errors.push(`asset ${asset.id}: character assets require accessible alt text`);
}
const achievementIds = new Set((outcomes.achievements ?? []).map((item) => item.id));
const deathIds = new Set((outcomes.deaths ?? []).map((item) => item.id));
for (const item of [...(outcomes.achievements ?? []), ...(outcomes.deaths ?? [])]) if (!claimMap.has(item.claim)) errors.push(`outcome registry ${item.id}: missing claim ${item.claim}`);

const storiesDir = join(root, "stories");
const usedNodeIds = new Set();
const usedOutcomeIds = new Set();
const usagesByClaim = new Map();
const recordClaimUsage = (claimId, usage, kind) => {
	if (!claimMap.has(claimId)) errors.push(`${kind}: missing claim ${claimId}`);
	else {
		const entries = usagesByClaim.get(claimId) ?? new Set();
		entries.add(usage);
		usagesByClaim.set(claimId, entries);
	}
};

const storyFiles = existsSync(storiesDir) ? readdirSync(storiesDir).filter((file) => file.endsWith(".ink")).map((file) => file.slice(0, -4)) : [];
if (!storyFiles.length) errors.push("stories: at least one .ink story is required");
for (const storyFile of storyFiles) {
	const meta = json(`stories/${storyFile}.json`);
	let ink = "";
	try { ink = read(`stories/${storyFile}.ink`); new Compiler(ink).Compile(); }
	catch (error) { errors.push(`stories/${storyFile}.ink: Ink compile failed: ${error.message}`); continue; }
	if (!meta?.id || !meta?.title || !meta?.canonicalEnding || !meta?.version) errors.push(`stories/${storyFile}.json: missing required metadata`);
	if (durationTarget && (meta?.durationMinutes < durationTarget.min || meta?.durationMinutes > durationTarget.max)) errors.push(`stories/${storyFile}.json: duration must be ${durationTarget.min}–${durationTarget.max} minutes`);
	const choices = [...ink.matchAll(/^\s*\*\s*\[([^\]]+)\]\s*(.*)$/gm)];
	diagnostics.choices += choices.length;
	const labels = new Set();
	for (const match of choices) {
		if (labels.has(match[1].trim())) errors.push(`duplicate choice label: ${match[1].trim()}`);
		labels.add(match[1].trim());
		const choiceTags = match[2];
		const nodeIds = tags(choiceTags, "node");
		if (nodeIds.length !== 1) errors.push(`choice “${match[1]}”: exactly one #node is required`);
		const nodeId = nodeIds[0];
		if (nodeId && usedNodeIds.has(nodeId)) errors.push(`duplicate story node ${nodeId}`);
		if (nodeId) usedNodeIds.add(nodeId);
		const evidence = tags(choiceTags, "evidence");
		const counters = tags(choiceTags, "counterfactual");
		const isCorrect = /#correct(?:\s|$)/.test(choiceTags);
		if (isCorrect) {
			diagnostics.canonicalChoices += 1;
			if (evidence.length !== 1) errors.push(`canonical choice ${nodeId ?? match[1]}: exactly one #evidence is required`);
			if (counters.length) errors.push(`canonical choice ${nodeId ?? match[1]}: cannot be counterfactual`);
			for (const claimId of evidence) {
				const claim = claimMap.get(claimId);
				if (claim && !["explicit", "inferred", "contested"].includes(claim.certainty)) errors.push(`canonical choice ${nodeId}: evidence ${claimId} is not source-grounded`);
				recordClaimUsage(claimId, nodeId, "choice evidence");
			}
		}
		for (const claimId of counters) {
			diagnostics.counterfactualChoices += 1;
			const claim = claimMap.get(claimId);
			if (claim && claim.certainty !== "counterfactual") errors.push(`choice ${nodeId}: ${claimId} must be counterfactual`);
			recordClaimUsage(claimId, nodeId, "choice counterfactual");
		}
	}
	const choiceGroups = [...ink.matchAll(/===\s*([^=\n]+)\s*===([\s\S]*?)(?=\n===|$)/g)].filter((block) => /^\s*\*/m.test(block[2])).length;
	if (meta?.choiceNodes !== choiceGroups) errors.push(`stories/${storyFile}.json: choiceNodes ${meta?.choiceNodes} does not match Ink ${choiceGroups}`);
	if (choiceNodeTarget && (choiceGroups < choiceNodeTarget.min || choiceGroups > choiceNodeTarget.max)) errors.push(`stories/${storyFile}.ink: expected ${choiceNodeTarget.min}–${choiceNodeTarget.max} major choice nodes`);
	for (const id of [...tags(ink, "bg"), ...tags(ink, "show")]) { diagnostics.assetReferences += 1; if (!assetIds.has(id)) errors.push(`stories/${storyFile}.ink: dangling asset ${id}`); }
	for (const sourceId of tags(ink, "hint")) if (!segmentMap.has(sourceId)) errors.push(`stories/${storyFile}.ink: dangling hint ${sourceId}`);
	for (const achievement of tags(ink, "achieve")) if (!achievementIds.has(achievement)) errors.push(`stories/${storyFile}.ink: dangling achievement ${achievement}`);
	for (const death of tags(ink, "death")) if (!deathIds.has(death)) errors.push(`stories/${storyFile}.ink: dangling death outcome ${death}`);
	const blocks = [...ink.matchAll(/===\s*([^=\n]+)\s*===([\s\S]*?)(?=\n===|$)/g)];
	for (const block of blocks) {
		const blockTags = block[2];
		if (!tags(blockTags, "status").length) errors.push(`stories/${storyFile}.ink:${block[1].trim()}: missing #status`);
		const outcomeIds = tags(blockTags, "outcome");
		for (const outcomeId of outcomeIds) {
			usedOutcomeIds.add(outcomeId); diagnostics.outcomes += 1;
			for (const claimId of [...tags(blockTags, "evidence"), ...tags(blockTags, "counterfactual")]) recordClaimUsage(claimId, outcomeId, "outcome claim");
		}
	}
	if (!usedOutcomeIds.has(meta?.canonicalEnding)) errors.push(`stories/${storyFile}.json: canonicalEnding has no #outcome`);
}

if (segmentTarget && segments.length < segmentTarget.min) errors.push(`sources: expected at least ${segmentTarget.min} source segments`);
if (claimTarget && claims.length < claimTarget.min) errors.push(`canon: expected at least ${claimTarget.min} claims`);
if (groundedClaimTarget && sourceGroundedClaims.length < groundedClaimTarget.min) errors.push(`canon: expected at least ${groundedClaimTarget.min} source-grounded claims`);
if (canonicalRouteTarget && (diagnostics.canonicalChoices < canonicalRouteTarget.min || diagnostics.canonicalChoices > canonicalRouteTarget.max)) errors.push(`stories: expected ${canonicalRouteTarget.min}–${canonicalRouteTarget.max} canonical route choices`);
if (endingTarget && diagnostics.outcomes < endingTarget.min) errors.push(`stories: expected at least ${endingTarget.min} endings`);
if (counterfactualTarget && diagnostics.counterfactualChoices < counterfactualTarget.min) errors.push(`stories: expected at least ${counterfactualTarget.min} counterfactual choices`);

for (const claim of claims) {
	for (const usage of claim.usages ?? []) {
		if (!usedNodeIds.has(usage) && !usedOutcomeIds.has(usage)) errors.push(`${claim.id}: usage does not exist in Ink: ${usage}`);
		if (!usagesByClaim.get(claim.id)?.has(usage)) errors.push(`${claim.id}: declared usage is not connected to its Ink tag: ${usage}`);
	}
	for (const actualUsage of usagesByClaim.get(claim.id) ?? []) if (!claim.usages?.includes(actualUsage)) errors.push(`${claim.id}: Ink tag is missing from declared usages: ${actualUsage}`);
}
diagnostics.citedClaims = usagesByClaim.size;
const report = { status: errors.length ? "failed" : "passed", diagnostics, errors };
const reportFile = resolve(process.env.CAGE_REPORT_DIR ?? "reports", manifest?.id ?? "unknown", "validation.json");
mkdirSync(dirname(reportFile), { recursive: true });
writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) {
	console.error(`Content validation failed (${errors.length})`);
	for (const error of errors) console.error(`- ${error}`);
	process.exit(1);
}
console.log(`Content validation passed: ${manifest.id} (${segments.length} segments, ${claims.length} claims, ${diagnostics.canonicalChoices} canonical choices, ${diagnostics.outcomes} outcomes)`);
