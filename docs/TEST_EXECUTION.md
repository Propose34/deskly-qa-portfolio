# Local test execution record

Recorded on 9 October 2026 (Asia/Bangkok). Windows host, Node.js 24.18.0, Playwright 1.64.0, Vite 7.3.7. Final catalog uses six local AI-generated product photos. Build and strict TypeScript checking passed.

| Mode  | Executions | Actual assertion passes | Actual failures | Unexpected outcomes | Duration | Start (Bangkok)      |
| ----- | ---------: | ----------------------: | --------------: | ------------------: | -------- | -------------------- |
| buggy |         69 |                      51 |              18 |                   0 | 93s      | 9 Oct 2026, 06:22:33 |
| fixed |         69 |                      69 |               0 |                   0 | 59s      | 9 Oct 2026, 06:24:38 |
| audit |          6 |                       0 |               6 |                   6 | 26s      | 9 Oct 2026, 06:25:38 |

The buggy baseline has 17 normal passes and six expected requirement failures per project. Playwright's console prints 69 passed because all outcomes match expectations; the underlying result summaries correctly distinguish 51 actual passes and 18 actual failures. No cases were skipped or retried. Fixed mode passes all 69 executions. Audit runs the six defect checks as ordinary tests on Chromium and intentionally exits 1; its six unexpected outcomes are the expected result of this demonstration command.

## Evidence

- [Buggy baseline JSON](evidence/buggy-summary.json)
- [Fixed verification JSON](evidence/fixed-summary.json)
- [Audit JSON](evidence/audit-summary.json)
- [Shipping-boundary failure screenshot](evidence/BUG-005.png)
- [Desktop preview](preview-desktop.png) and [mobile preview](preview-mobile.png)

The most recent local HTML report and all six audit traces/videos/screenshots remain in ignored playwright-report/ and test-results/ folders. Run npm run report to open the latest audit report; future test runs overwrite it. Reports are generated evidence, not a promise of later executions. The compact JSON files above omit machine-specific paths.

## Infrastructure finding and corrective action

An earlier four-worker fixed run (before the image-load case was added) had 59 passes and seven Firefox context-teardown protocol failures: Browser.removeBrowserContext reported an undefined _maybeDontRestoreTabs session-store entry. These occurred during context close, not storefront assertions. [Initial failure summary](evidence/fixed-initial-summary.json) preserves that result.

Re-running all 66 cases with one worker passed. The final configuration therefore defaults to one worker, with zero retries; the final 23-case buggy/fixed runs above use that configuration. This bounds the observed Windows concurrency problem without changing assertions or excluding Firefox. Additional parallelism needs verification on the target host. GitHub Actions is configured but has not been executed remotely; it will run after the project is pushed.
