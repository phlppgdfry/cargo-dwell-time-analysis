"""Reconcile public artifacts with the canonical workbook and date arithmetic."""
import csv
import json
from datetime import date
from pathlib import Path
from openpyxl import load_workbook

root = Path(__file__).resolve().parents[1]
records = json.loads((root / 'demo/data.json').read_text())
workbook_rows = list(load_workbook(root / 'dashboards/analysis-data.xlsx', data_only=True)['Container_Movements'].values)[2:]
assert len(records) == len(workbook_rows) == 500
assert len({r['container_id'] for r in records}) == 500
for r, original in zip(records, workbook_rows):
    assert r['container_id'] == original[0]
    assert (date.fromisoformat(r['departure_date']) - date.fromisoformat(r['arrival_date'])).days == r['dwell_days'] == original[3]
    assert r['doc_processing_hrs'] == original[9]
    assert r['demurrage_cost_eur'] == original[10]
assert sum(r['dwell_days'] for r in records) / len(records) == 5.982
assert sum(r['demurrage_cost_eur'] for r in records) == 199900
with (root / 'demo/container_movements.csv').open() as file:
    exported = list(csv.DictReader(file))
assert len(exported) == len(records)
for raw, record in zip(exported, records):
    assert all(raw[k] == str(v) for k,v in record.items())
print('PASS: 500 workbook, JSON and CSV records reconcile; dates, dwell, costs and documentation hours match.')
