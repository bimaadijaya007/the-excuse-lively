import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const LINE =
  "Dear judge, my loss function converged perfectly \u2014 it just converged on losing.";

function validate(line) {
  if (typeof line !== "string" || line.length === 0) {
    throw new Error("entry line must be a non-empty string");
  }
  if (line.trim().length === 0) {
    throw new Error("entry line must not be only whitespace");
  }
  if (line.length > 200) {
    throw new Error(`entry line is ${line.length} characters, over the 200 limit`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry line must be a single line");
  }
  if (line !== line.trim()) {
    throw new Error("entry line must not start or end with whitespace");
  }
  const bytes = Buffer.byteLength(line, "utf8");
  if (bytes < 1 || bytes > 400) {
    throw new Error(`entry line is ${bytes} bytes, outside the 1-400 byte range`);
  }
}

function main() {
  validate(LINE);
  const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR || "/output");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== LINE) {
    throw new Error("round-trip check failed: entry.txt does not match the line");
  }
  console.log(`wrote ${LINE.length} characters to ${outPath}`);
  console.log(LINE);
}

main();
