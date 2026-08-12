import { z } from "zod";

export const CERTAINTIES = [
	"explicit",
	"inferred",
	"contested",
	"invented",
	"counterfactual",
] as const;

export type Certainty = (typeof CERTAINTIES)[number];

export interface BookManifest {
	id: string;
	title: string;
	language: string;
	version: string;
	license: string;
	defaultRenderer: "dom" | "pixi";
}

export interface SourceSegment {
	id: string;
	text: string;
	chapter: string;
	sequence: number;
}

export interface Claim {
	id: string;
	statement: string;
	certainty: Certainty;
	sourceRefs: string[];
	usages: string[];
}

export interface StoryManifest {
	id: string;
	title: string;
	classicId: string;
	renderer: "dom" | "pixi";
	canonicalEnding: string;
	durationMinutes: number;
}

export interface AssetManifestEntry {
	id: string;
	type: "background" | "character" | "audio" | "placeholder";
	status: "placeholder" | "draft" | "reviewed" | "released";
	path?: string;
	license?: string;
}

export interface ContentPack {
	manifest: BookManifest;
	segments: SourceSegment[];
	claims: Claim[];
	stories?: StoryManifest[];
	assets?: AssetManifestEntry[];
}

export const bookManifestSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	language: z.string().min(2),
	version: z.string().min(1),
	license: z.string().min(1),
	defaultRenderer: z.enum(["dom", "pixi"]),
});

export const sourceSegmentSchema = z.object({
	id: z.string().min(1),
	text: z.string().min(1),
	chapter: z.string().min(1),
	sequence: z.number().int().positive(),
});

export const claimSchema = z.object({
	id: z.string().min(1),
	statement: z.string().min(1),
	certainty: z.enum(CERTAINTIES),
	sourceRefs: z.array(z.string()),
	usages: z.array(z.string()).min(1),
});

export const storyManifestSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	classicId: z.string().min(1),
	renderer: z.enum(["dom", "pixi"]),
	canonicalEnding: z.string().min(1),
	durationMinutes: z.number().positive(),
});

export const assetManifestEntrySchema = z.object({
	id: z.string().min(1),
	type: z.enum(["background", "character", "audio", "placeholder"]),
	status: z.enum(["placeholder", "draft", "reviewed", "released"]),
	path: z.string().optional(),
	license: z.string().optional(),
});

export const contentPackSchema = z.object({
	manifest: bookManifestSchema,
	segments: z.array(sourceSegmentSchema),
	claims: z.array(claimSchema),
	stories: z.array(storyManifestSchema).optional(),
	assets: z.array(assetManifestEntrySchema).optional(),
});
