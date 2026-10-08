# Defect register

All six defects are intentionally seeded for training. Status: open in buggy edition; corrected in fixed edition. Environment: local Vite app, fresh browser context. Automated IDs map directly to TEST_CASES.md. Use the audit command to create timestamped HTML reports, screenshots, videos and traces; concrete run results belong in TEST_EXECUTION.md.

## BUG-001

**Title:** Lowercase search misses matching product · **Severity:** Medium · **Priority:** P2 · **Case:** TC-017

Steps: open shop → search `arc`.

Expected: Arc desk lamp appears. Actual: zero results. Impact: customers cannot reliably discover products. Cause: case-sensitive string comparison. Correction: normalize both names and query to lowercase. Verification: TC-017 against fixed mode.

## BUG-002

**Title:** Price sort compares strings · **Severity:** Medium · **Priority:** P2 · **Case:** TC-018

Steps: open shop → choose Price: low to high.

Expected: 400, 600, 800, 1200, 2400, 3200. Actual: 1200, 2400, 3200, 400, 600, 800. Impact: discovery ordering is misleading. Cause: lexical sort of converted prices. Correction: numeric comparator. Verification: TC-018 against fixed mode.

## BUG-003

**Title:** Bag quantity exceeds available stock · **Severity:** High · **Priority:** P1 · **Case:** TC-019

Steps: add lamp → open bag → increase quantity three times.

Expected: quantity caps at 3; increment disabled. Actual: quantity reaches 4. Impact: impossible stock quantity accepted. Cause: missing stock guard in add/increment paths. Correction: enforce catalog stock and disable increment at limit. Verification: TC-019 against fixed mode (tests increment path; direct repeated add is an exploratory follow-up).

## BUG-004

**Title:** Reapplying DESK10 stacks the discount · **Severity:** High · **Priority:** P1 · **Case:** TC-020

Steps: add lamp → apply DESK10 → apply it again.

Expected: discount remains ฿120 (10%). Actual: discount becomes ฿240 (20%). Impact: incorrect purchase total; repeated applications can create a negative total. Cause: additive discount mutation. Correction: assign a single 10% rate. Verification: TC-020 against fixed mode.

## BUG-005

**Title:** Exact free-shipping threshold still charged · **Severity:** Medium · **Priority:** P1 · **Case:** TC-021

Steps: add lamp (1200) and catchall (800) → open bag.

Expected: subtotal ฿2,000; shipping ฿0. Actual: shipping ฿100; total ฿2,100. Impact: offer is not honored at its advertised boundary. Cause: `>` rather than `>=`. Correction: inclusive threshold on pre-discount subtotal. Verification: TC-021 against fixed mode.

## BUG-006

**Title:** Whitespace checkout fields accepted · **Severity:** High · **Priority:** P1 · **Case:** TC-022

Steps: add lamp → checkout → enter three spaces for name/address, `alex@example.com` for email → submit.

Expected: validation error, no confirmation, bag retained. Actual: order confirmed and bag cleared. Impact: unusable delivery information accepted. Cause: checking truthiness without trimming. Correction: trim required text before validation. Verification: TC-022 against fixed mode.
