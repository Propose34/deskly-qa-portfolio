# Test cases and traceability

Precondition for every case: fresh browser context, initial catalog, empty stored bag. Run each on every configured project. `Expected defect` describes buggy-mode disposition, not the desired product behavior.

| Case   | Requirement    | Priority | Steps / data                                            | Expected result                                       | Buggy baseline          |
| ------ | -------------- | -------- | ------------------------------------------------------- | ----------------------------------------------------- | ----------------------- |
| TC-001 | R-01           | P1       | Open shop                                               | Six cards                                             | Pass                    |
| TC-002 | R-01           | P1       | Select Tech                                             | Keyboard and headphones only                          | Pass                    |
| TC-003 | R-01           | P2       | Search Arc                                              | Lamp only                                             | Pass                    |
| TC-004 | R-01           | P2       | Search unicorn                                          | Empty message; zero cards                             | Pass                    |
| TC-005 | R-04,R-05,R-06 | P1       | Add lamp; open bag                                      | Subtotal 1200; total 1300                             | Pass                    |
| TC-006 | R-04           | P2       | Open empty bag                                          | Empty state                                           | Pass                    |
| TC-007 | R-03           | P1       | Add lamp; Remove                                        | Empty state                                           | Pass                    |
| TC-008 | R-04           | P1       | Add lamp; reload; open bag                              | One lamp persists                                     | Pass                    |
| TC-009 | R-03           | P1       | Inspect plant add button                                | Disabled                                              | Pass                    |
| TC-010 | R-05           | P1       | Add lamp; DESK10                                        | Discount 120; total 1180                              | Pass                    |
| TC-011 | R-05           | P2       | Add lamp; INVALID                                       | Error; discount zero                                  | Pass                    |
| TC-012 | R-06           | P1       | Add keyboard (2400)                                     | Shipping zero                                         | Pass                    |
| TC-013 | R-07,R-04      | P1       | Add lamp; Alex Tester / alex@example.com / 99 Test Lane | Confirmation; bag empty when reopened                 | Pass                    |
| TC-014 | R-07           | P1       | Checkout with email invalid                             | Validation error; no order                            | Pass                    |
| TC-015 | R-08           | P2       | Compare page width with viewport                        | No horizontal overflow                                | Pass                    |
| TC-016 | R-08           | P2       | Open bag; Escape                                        | Dialog closes                                         | Pass                    |
| TC-017 | R-01           | P2       | Search lowercase arc                                    | Lamp visible                                          | Expected defect BUG-001 |
| TC-018 | R-02           | P2       | Sort ascending                                          | 400,600,800,1200,2400,3200                            | Expected defect BUG-002 |
| TC-019 | R-03           | P1       | Add lamp; increment to stock 3; attempt extra           | Qty 3; plus disabled                                  | Expected defect BUG-003 |
| TC-020 | R-05           | P1       | Add lamp; apply DESK10 twice                            | Discount remains 120                                  | Expected defect BUG-004 |
| TC-021 | R-06           | P1       | Add lamp + catchall                                     | Subtotal 2000; shipping zero                          | Expected defect BUG-005 |
| TC-022 | R-07           | P1       | Checkout with spaces in name/address; valid email       | Error; no order                                       | Expected defect BUG-006 |
| TC-023 | R-09           | P2       | Load catalog; inspect all six product images            | Images decode successfully and have nonempty alt text | Pass                    |

Automated implementation: `tests/shop.spec.ts`. Fixed mode expects all rows to pass. P1 = purchase integrity/core flow; P2 = discovery/usability. Coverage is scoped to the rows above; exploratory items are in TEST_PLAN.md.
