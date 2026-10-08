# QA test plan

## Objective

Demonstrate a repeatable quality workflow: requirement → test case → automated check → failure evidence → defect → verification against a corrected build.

## Approach and risk

Prioritize purchase integrity (stock, discounts, totals, input validation), then discovery and responsive usability. Use equivalence classes for valid/invalid search and email, boundary testing around the shipping threshold, state transitions for bag removal/order completion, and repeated-action testing for coupon idempotency.

## Scope

23 automated cases run on desktop Chromium, desktop Firefox, and mobile Chromium emulating Pixel 7. Each test receives a fresh browser context. The page object expresses reusable customer actions; assertions stay in specs. There are no fixed sleeps, shared test accounts, external assets, or network fixtures.

Out of scope: real payment, backend/API security, authentication, load tests, full accessibility audit, real mobile hardware, and screenshot baseline comparisons. A viewport overflow check is not a full visual regression suite.

## Execution modes

- `npm test`: buggy edition. Six known requirement failures per project are explicitly marked expected with `test.fail`. Unexpected passes are also errors. An exit code of zero means the observed results match the documented baseline, **not that all requirements pass**.
- `npm run test:audit`: the six defect cases run as normal tests on Chromium; intentionally exits nonzero and generates failure evidence.
- `npm run test:fixed`: same 23 cases and assertions against the fixed edition; all are expected to pass.
- `npm run test:smoke`: five core checks on all configured projects.

The test server uses isolated port 5174 and never reuses an existing server, preventing a fixed run from silently testing a buggy preview. Human preview uses 5173. CI validates both modes independently, with zero retries so unstable tests are visible.

## Entry and exit

The default is one worker after an observed Windows Firefox context-close protocol error during a four-worker run. This retains all browser coverage without retries. Use a CLI worker override only after validating stability on your machine; the initial infrastructure failure is recorded separately from product defects in TEST_EXECUTION.md.

Entry: Node dependencies and Playwright browsers installed; requirements and seeded defect inventory available. Baseline exit: all normal checks pass, exactly six known defects reproduce per project, no unexpected failure. Fixed exit: every case passes on all three projects. Save HTML/JSON reports and traces for failures; review the defect assertions before accepting a baseline.

## Manual review checklist

Inspect desktop/mobile typography and card spacing, keyboard focus visibility, modal focus containment, long input values, search+category combinations, descending sort, quantity decrement from one, coupon after item changes, and reload after successful checkout. These checks are recommended exploratory follow-ups and are not reported as automated coverage.

## References

Playwright [expected-failure annotations](https://playwright.dev/docs/test-annotations) and [managed test server](https://playwright.dev/docs/test-webserver).
