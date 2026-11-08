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
