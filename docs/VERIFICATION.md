# Closeout audit — 24 November 2026

CSV export is disabled until the dataset is loaded. Missing or empty data produces an explained error state. Workbook/JSON/CSV reconciliation and the one-page management PDF checks pass.

4 Chromium browser checks passed across 1440×1000 desktop and 390×844 mobile emulation. No uncaught page errors or horizontal page overflow were observed. The full five-project set contains 20 browser checks. Current npm audit: zero known vulnerabilities. Publication uses the immutable artifact ID from the upload output and the official Pages REST API with job-scoped OIDC. Five deployment tests cover success, mismatched source artifacts, failed deploys, status outages and timeout/cancellation. Credentials and request payloads are not logged. Local Markdown links resolve. Browser plugin not available; validation used Playwright. Physical devices, Safari and production terminal/ERP integrations are outside this synthetic portfolio acceptance scope.

# Verification — 24 November 2026

The management brief is rebuilt from the reconciled 500-row source: mean 5.982 days, 295 movements above five days and EUR 199,900 sample demurrage. It is downloadable inside the dashboard. The original assumption-based PDF is preserved in findings/archive/.

Current checks: production build, functional browser flows on desktop/mobile, CSV/download contents and no uncaught browser errors. PDF source reconciliation and gate-validator checks run in their respective CI pipelines. Updated screenshots are actual renders of the production artifacts.

## Earlier release evidence

# Verification record

Portfolio refresh · 8 November 2026

- `python3 scripts/check_data.py`: all 500 workbook/JSON/CSV movements reconcile,
  including date arithmetic, dwell, documentation hours and costs.
- Executed schema, CSV import and all five queries against a temporary local
  PostgreSQL 15 instance: 500 records, mean 5.982 days, 59.00% above five days,
  3.70 documentation hours and €199,900 sample demurrage.
- GitHub workflow repeats SQL execution using a PostgreSQL 16 service.
- Chromium: agent cohort (MSC: 92 records), empty search, reset, documentation
  drilldown (128 records), sensitivity at zero/three days and CSV download passed.
- Desktop/mobile fit and zero uncaught JavaScript errors checked.
- The sector benchmark and annual investment case are not validated observations.

## Browser evidence

Desktop screenshots use a 1440 × 1040 viewport; mobile screenshots use 390 × 844.
These are actual Chromium captures of the built applications, not design mockups.
Screenshots show sample data. External map, chart-library or weather availability
can vary independently of the application.

- [Desktop capture](screenshots/desktop.png)
- [Mobile capture](screenshots/mobile.png)
- [Local commands and demo boundary](PORTFOLIO.md)

The public deployment is built from the committed source by
`.github/workflows/portfolio-pages.yml`. Review its Actions run for the exact
commit and deployment result; this note is not a claim of production integration
certification, a full accessibility audit or a penetration test.

## Final review — 15 November 2026

The published demo was rechecked in Chromium using Playwright at 1440 × 1040
and 390 × 844. Page identity, meaningful content, absence of framework overlays,
working user interactions and CSV contents all passed. No uncaught JavaScript
errors or page-level horizontal overflow were observed. Desktop and mobile
screenshots were refreshed from the published demo.

The exact routes, viewports and interaction checks are recorded in
[the machine-readable final review](verification/final-review.json).
The finalized source is preserved by the `portfolio-2026-11-15` release tag.
