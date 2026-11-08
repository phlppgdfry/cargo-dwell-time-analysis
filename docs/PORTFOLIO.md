# CargoLens portfolio walkthrough

1. Compare the four headline KPIs with the 500-row source export.
2. Select an agent or arrival year; all metrics and the CSV use that selection.
3. Select a delay reason to inspect the corresponding delayed containers.
4. Move the documentation slider. Only documentation-delayed containers over
   five days change in the sensitivity model; observed metrics do not change.
5. Export the selection or inspect the paginated record table. Reset filters
   restores all 500 movements.

## Run locally

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/demo/`. No account, API or JavaScript dependency is
required. Native SVG charts and HTML tables remain self-contained.

## Rebuild and verify the data

```sh
python3 -m pip install -r requirements-dev.txt
python3 scripts/export_data.py
python3 scripts/check_data.py
```

The movement sheet is canonical. The other workbook sheets and historical PDF
are illustrative narrative material, not independently reconciled analysis.
Use `sql/schema.sql` and `sql/queries.sql` to reproduce the same metrics in
PostgreSQL. All company names and movements form a synthetic portfolio exercise.
