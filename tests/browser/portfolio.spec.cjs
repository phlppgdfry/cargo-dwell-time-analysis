const { test, expect } = require('@playwright/test');
async function downloaded(page, action) {
  const pending = page.waitForEvent('download'); await action(); const download = await pending;
  const stream = await download.createReadStream(); const chunks=[];
  for await (const chunk of stream) chunks.push(chunk);
  return {name:download.suggestedFilename(), data:Buffer.concat(chunks)};
}
test.beforeEach(async ({page}) => {
  page._errors=[]; page.on('pageerror',error=>page._errors.push(error.message));
});
test.afterEach(async ({page}) => { expect(page._errors).toEqual([]); });

test('source metrics, filtered export, sensitivity model and current PDF', async ({page}) => {
  await page.goto('/'); await expect(page.locator('#avg')).toHaveText(/5[.,]98/);
  await page.getByLabel('Shipping agent').selectOption({label:'MSC Zeebrugge'});
  const file=await downloaded(page,()=>page.getByRole('button',{name:'Export selection',exact:true}).click());
  expect(file.data.toString()).toContain('MSC Zeebrugge'); expect(file.data.toString().trim().split(/\r?\n/)).toHaveLength(93);
  await page.getByRole('button',{name:'Reset filters'}).click();
  await page.locator('#improvement').fill('0'); await expect(page.locator('#model')).toHaveText(/5[.,]98/);
  await page.locator('#search').fill('NO-MATCH'); await expect(page.locator('#records')).toContainText('No');
  await page.getByRole('button',{name:'Reset filters'}).click();
  const pdf=await downloaded(page,()=>page.getByRole('link',{name:'Download management brief (PDF)'}).click());
  expect(pdf.name).toBe('management-summary.pdf');expect(pdf.data.subarray(0,5).toString()).toBe('%PDF-');
});
