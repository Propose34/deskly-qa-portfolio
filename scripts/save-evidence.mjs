import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const label = process.argv[2];
if (!label || !/^[a-z0-9-]+$/.test(label))
  throw new Error("Usage: node scripts/save-evidence.mjs buggy|fixed|audit");
const report = JSON.parse(
  readFileSync(process.argv[3] || "test-results/results.json", "utf8"),
);
const cases = [];
function visit(suite) {
  for (const spec of suite.specs || [])
    for (const test of spec.tests) {
      const result = test.results.at(-1);
      cases.push({
        case: spec.title,
        project: test.projectName,
        expectedStatus: test.expectedStatus,
        actualStatus: result.status,
        disposition: test.status,
        errorSummary: (result.errors[0]?.message || "")
          .replace(/\u001b\[[0-9;]*m/g, "")
          .split("\n")[0],
      });
    }
  for (const child of suite.suites || []) visit(child);
}
for (const suite of report.suites) visit(suite);
mkdirSync("docs/evidence", { recursive: true });
writeFileSync(
  `docs/evidence/${label}-summary.json`,
  JSON.stringify(
    {
      label,
      recordedAtUTC: report.stats.startTime,
      stats: report.stats,
      actualPassed: cases.filter((c) => c.actualStatus === "passed").length,
      actualFailed: cases.filter((c) => c.actualStatus === "failed").length,
      cases,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Saved docs/evidence/${label}-summary.json (${cases.length} executions)`,
);
