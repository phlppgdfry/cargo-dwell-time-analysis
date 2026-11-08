"""Rebuild the public demo from the original workbook, without external services."""
import csv
import json
from pathlib import Path
from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parents[1]
FIELDS = ['container_id', 'arrival_date', 'departure_date', 'dwell_days', 'shipper',
          'shipping_agent', 'container_type', 'cargo_type', 'delay_reason',
          'doc_processing_hrs', 'demurrage_cost_eur']

def export():
    workbook = load_workbook(ROOT / 'dashboards/analysis-data.xlsx', data_only=True)
    records = []
    for row in list(workbook['Container_Movements'].values)[2:]:
        if not row[0]:
            continue
        record = dict(zip(FIELDS, row))
        for field in ['arrival_date', 'departure_date']:
            record[field] = record[field].date().isoformat()
        assert record['dwell_days'] >= 0
        records.append(record)
    assert len(records) == 500 and len({r['container_id'] for r in records}) == 500
    (ROOT / 'demo').mkdir(exist_ok=True)
    (ROOT / 'demo/data.json').write_text(json.dumps(records, indent=2) + '\n')
    with (ROOT / 'demo/container_movements.csv').open('w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=FIELDS, lineterminator='\n')
        writer.writeheader()
        writer.writerows(records)
    print(f'Exported {len(records)} movements; mean dwell {sum(r["dwell_days"] for r in records)/len(records):.3f} days')

if __name__ == '__main__':
    export()
