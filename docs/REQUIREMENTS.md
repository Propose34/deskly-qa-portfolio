# Deskly — product requirements

Version 1.0 · Local demo · Currency THB · No tax or payment gateway

| ID   | Acceptance criterion                                                                                                                                   |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| R-01 | Display all six catalog items; category and search filters combine. Search is case-insensitive and trims surrounding spaces.                           |
| R-02 | Ascending/descending price order uses numeric THB prices.                                                                                              |
| R-03 | Sold-out products cannot be added. Quantity stays between 1 and available stock; reducing from 1 removes the line.                                     |
| R-04 | Adding the same item increments its line. Bag persists across reloads in the same browser.                                                             |
| R-05 | Subtotal is the sum of price × quantity. DESK10 discounts the subtotal by 10%, once per bag; invalid codes do not change totals.                       |
| R-06 | Shipping costs ฿100 below ฿2,000 and is free at or above ฿2,000. Eligibility uses the subtotal before discounts.                                       |
| R-07 | Checkout requires non-whitespace name/address and an email matching the demo validation rule. Valid checkout shows confirmation and clears stored bag. |
| R-08 | UI supports desktop and mobile without horizontal overflow; bag supports Escape and labeled controls.                                                  |
| R-09 | All six product cards show locally bundled product photographs that load successfully and have descriptive alternative text.                           |

Discount remains applied while changing nonempty bag quantities and resets when the bag becomes empty. Checkout is a browser-local simulation: no login, server API, real stock reservation, payment, or fulfillment. Local storage is test/demo data only. The fixed edition corrects the six documented defects; it is not a claim of production readiness.
