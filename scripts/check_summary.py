from pathlib import Path
from pypdf import PdfReader
root=Path(__file__).resolve().parents[1]
path=root/'findings/executive-summary.pdf'
reader=PdfReader(path)
assert len(reader.pages)==1
text=reader.pages[0].extract_text()
for fact in ['5.982','59%','295','199,900','128','5.598','Synthetic']:
    assert fact.lower() in text.lower(), f'Missing report fact: {fact}'
assert path.read_bytes()==(root/'demo/management-summary.pdf').read_bytes()
print('Management PDF verified: one page, current metrics, identical public download')
