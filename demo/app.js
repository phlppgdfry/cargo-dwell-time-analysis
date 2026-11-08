let data = [], rows = [], page = 0, selectedCause = '';
const $ = id => document.getElementById(id);
const euro = n => new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mean = (items,key) => items.length ? items.reduce((sum,r)=>sum+r[key],0)/items.length : 0;
function render() {
  const search = $('search').value.toLowerCase();
  rows = data.filter(r=>(!$('agent').value || r.shipping_agent===$('agent').value) && (!$('year').value || r.arrival_date.startsWith($('year').value)) && (!selectedCause || (r.dwell_days>5 && r.delay_reason===selectedCause)) && [r.container_id,r.shipper,r.cargo_type].some(v=>v.toLowerCase().includes(search)));
  $('feedback').textContent = `${rows.length} of ${data.length} source records selected${selectedCause ? ' · '+selectedCause : ''}. Metrics and CSV use this selection.`;
  $('avg').textContent = rows.length ? mean(rows,'dwell_days').toFixed(2) : '—';
  const delayed = rows.filter(r=>r.dwell_days>5);
  $('over').textContent = rows.length ? (delayed.length/rows.length*100).toFixed(1)+'%' : '—';
  $('over-detail').textContent = `${delayed.length} of ${rows.length} containers`;
  $('doc').textContent = rows.length ? mean(rows,'doc_processing_hrs').toFixed(1)+' h' : '—';
  $('cost').textContent = euro(rows.reduce((s,r)=>s+r.demurrage_cost_eur,0));
  $('clear-cause').hidden = !selectedCause;
  const causes = Object.entries(delayed.reduce((o,r)=>(o[r.delay_reason]=(o[r.delay_reason]||0)+1,o),{})).sort((a,b)=>b[1]-a[1]);
  $('causes').replaceChildren();
  for (const [reason,count] of causes) {
    const button=document.createElement('button');button.className='cause'+(selectedCause===reason?' selected':'');button.setAttribute('aria-pressed',String(selectedCause===reason));
    button.innerHTML=`${esc(reason)}<b>${(count/delayed.length*100).toFixed(1)}% <small>(${count})</small></b><span style="width:${count/delayed.length*100}%"></span>`;
    button.onclick=()=>{selectedCause=selectedCause===reason?'':reason;page=0;render();};$('causes').append(button);
  }
  if (!causes.length) $('causes').textContent='No delayed containers in this selection.';
  drawTrend();model();renderTable();
}
function drawTrend() {
  const months={};rows.forEach(r=>{const key=r.arrival_date.slice(0,7);(months[key]??=[]).push(r);});
  const groups=Object.entries(months).sort(([a],[b])=>a.localeCompare(b));
  if (!groups.length) {$('trend').textContent='No movements match. Reset filters to return to the full analysis.';return;}
  const width=610,height=236,pad=30,base=192,max=Math.max(10,...groups.map(([,r])=>mean(r,'dwell_days'))),step=(width-pad*2)/groups.length;
  let svg=`<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Average dwell time by month in days"><title>Average dwell time by month in days</title>`;
  for(const y of [0,5,10]){const py=base-y/max*(base-20);svg+=`<line x1="${pad}" y1="${py}" x2="${width-10}" y2="${py}" stroke="${y===5?'#a74c21':'#dce4e9'}" ${y===5?'stroke-dasharray="4 4"':''}/><text x="4" y="${py+4}">${y}d</text>`;}
  groups.forEach(([month,items],i)=>{const avg=mean(items,'dwell_days'),h=avg/max*(base-20),x=pad+i*step+step*.18;svg+=`<rect x="${x}" y="${base-h}" width="${step*.64}" height="${h}" rx="3" fill="#246996"><title>${month}: ${avg.toFixed(2)} days, ${items.length} containers</title></rect>`;if(i%Math.max(1,Math.ceil(groups.length/6))===0)svg+=`<text x="${x}" y="216">${month.slice(2)}</text>`;});
  $('trend').innerHTML=svg+'</svg>';
  $('trend').setAttribute('aria-label',groups.map(([m,r])=>`${m}: ${mean(r,'dwell_days').toFixed(2)} days`).join('; '));
}
function model() {
  const reduction=Number($('improvement').value);$('slider-value').textContent=reduction.toFixed(1);
  const affected=rows.filter(r=>r.delay_reason==='Documentation delay' && r.dwell_days>5);
  const total=rows.reduce((s,r)=>s+Math.max(0,r.dwell_days-(affected.includes(r)?reduction:0)),0);
  $('model').textContent=rows.length?(total/rows.length).toFixed(2)+' days':'—';
  $('model-detail').textContent=`${affected.length} affected containers · ${rows.length?(mean(rows,'dwell_days')-total/rows.length).toFixed(2):'0.00'} days lower across the selection`;
}
function renderTable() {
  const pages=Math.max(1,Math.ceil(rows.length/10));page=Math.min(page,pages-1);
  $('records').innerHTML=rows.slice(page*10,page*10+10).map(r=>`<tr><td>${esc(r.container_id)}</td><td>${esc(r.shipping_agent)}</td><td>${r.arrival_date}</td><td><span class="${r.dwell_days>5?'late':''}">${r.dwell_days} days</span></td><td>${esc(r.delay_reason)}</td><td>${euro(r.demurrage_cost_eur)}</td></tr>`).join('')||'<tr><td colspan="6">No matching movements. Reset your filters to start again.</td></tr>';
  $('page').textContent=`Page ${page+1} of ${pages}`;$('prev').disabled=page===0;$('next').disabled=page>=pages-1;
  $('table-summary').textContent=`${rows.length} movements · ${selectedCause||'all delay reasons'}`;
}
$('prev').onclick=()=>{page--;renderTable();};$('next').onclick=()=>{page++;renderTable();};
for(const id of ['agent','year','search']) $(id).addEventListener('input',()=>{page=0;render();});
$('clear-cause').onclick=()=>{selectedCause='';page=0;render();};
$('reset').onclick=()=>{for(const id of ['agent','year','search'])$(id).value='';selectedCause='';page=0;render();};
$('improvement').oninput=model;
$('export').onclick=()=>{
  const fields=Object.keys(data[0]);const csv=[fields,...rows.map(r=>fields.map(k=>r[k]))].map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='cargo-selection.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
fetch('data.json').then(r=>{if(!r.ok)throw Error('Dataset unavailable');return r.json();}).then(records=>{data=records;for(const name of [...new Set(data.map(r=>r.shipping_agent))].sort()){$('agent').add(new Option(name,name));}render();}).catch(()=>{$('feedback').textContent='The dataset could not be loaded. Reload the page, or run python3 -m http.server from this project locally.';for(const el of document.querySelectorAll('button,input,select'))el.disabled=true;});
