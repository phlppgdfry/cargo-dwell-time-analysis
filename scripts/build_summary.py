"""Rebuild the management brief from the dashboard's reconciled source records."""
from pathlib import Path
import json, hashlib
from collections import Counter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
ROOT = Path(__file__).resolve().parents[1]
raw = (ROOT / 'demo/data.json').read_bytes()
rows = json.loads(raw)
n = len(rows)
delayed = [r for r in rows if r['dwell_days'] > 5]
counts = Counter(r['delay_reason'] for r in delayed)
avg = sum(r['dwell_days'] for r in rows) / n
cost = sum(r['demurrage_cost_eur'] for r in rows)
affected = [r for r in delayed if r['delay_reason'] == 'Documentation delay']
model = sum(max(0, r['dwell_days'] - 1.5) if r in affected else r['dwell_days'] for r in rows) / n
out = ROOT / 'findings/executive-summary.pdf'
c = canvas.Canvas(str(out), pagesize=(595.28, 841.89), invariant=1)
c.setTitle('CargoLens | Management brief | 24 November 2026')
c.setAuthor('Philippe Godfroy')
navy, blue, muted = '#17354E', '#2E6B91', '#536777'
def text(x, y, value, size=11, color=navy, bold=False):
    c.setFillColor(HexColor(color)); c.setFont('Helvetica-Bold' if bold else 'Helvetica', size); c.drawString(x,y,value)
c.setFillColor(HexColor(navy)); c.rect(0, 690, 596, 152, fill=1, stroke=0)
text(42, 793, 'CARGOLENS / MANAGEMENT BRIEF', 11, '#AFCDE0', True)
text(42, 751, 'Where dwell time accumulates', 24, '#FFFFFF', True)
text(42, 722, '500 synthetic movements | Jan 2023 - Jun 2024 | Reviewed 24 Nov 2026', 10, '#FFFFFF')
for x, label, value in [(42,'MEAN DWELL',f'{avg:.3f} days'),(218,'OVER 5 DAYS',f'{len(delayed)/n:.0%} ({len(delayed)})'),(392,'SAMPLE DEMURRAGE',f'EUR {cost:,.0f}')]:
    text(x,659,label,9,muted,True);text(x,630,value,19,navy,True)
text(42,585,'01  Documentation is the largest recorded delay category',13,bold=True)
text(42,563,'Reasons below are counted only among movements exceeding five days.',10,muted)
for i,(reason,count) in enumerate(counts.most_common()):
    y=530-i*39
    text(42,y,reason,10);c.setFillColor(HexColor(blue));c.rect(220,y-3,210*count/max(counts.values()),14,fill=1,stroke=0)
    text(445,y,f'{count} / {count/len(delayed):.1%}',10)
text(42,309,'02  Test a bounded improvement scenario',13,bold=True)
text(42,285,f'Removing 1.5 dwell days from {len(affected)} documentation-delayed movements',11)
text(42,265,f'changes the sample mean from {avg:.3f} to {model:.3f} days.',11,bold=True)
text(42,242,'Sensitivity only: no causal effect or financial saving has been established.',10,muted)
text(42,205,'03  Decision and next measurement',13,bold=True)
for y,line in zip([182,164,146],[
    'Pilot earlier document checks; measure document-ready and release timestamps.',
    'Compare matched shipments before estimating an operational or annual saving.',
    'The historical 6.4-day / 25% business case is not reproduced by these records.']): text(42,y,line,10,muted)
c.setStrokeColor(HexColor('#D8E2E8'));c.line(42,119,553,119)
text(42,99,'SOURCE: demo/data.json, reconciled against the original workbook and CSV.',9)
text(42,83,'SHA-256: '+hashlib.sha256(raw).hexdigest()[:32],8,muted)
text(42,61,'Independent portfolio exercise. Synthetic data; no endorsed terminal performance claim.',9,muted)
text(530,35,'1 / 1',9,muted)
c.showPage();c.save()
(ROOT/'demo/management-summary.pdf').write_bytes(out.read_bytes())
print(f'Built management brief: {n} rows, {avg:.3f} days, {len(delayed)} delayed, EUR {cost}, model {model:.3f}')
