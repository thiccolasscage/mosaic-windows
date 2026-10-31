// Import parsers, driven through the real Add box and Load file button.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { launch, openApp, addText, addFile, tiles } = require('./helpers');

let browser; before(async () => { browser = await launch(); }); after(() => browser.close());
const urls = b => tiles(b).filter(t => t.kind === 'link').map(t => t.url).sort();
const notes = b => tiles(b).filter(t => t.kind === 'note').map(t => t.title).sort();
const groupOf = (b, url) => b.groups.find(g => g.tileIds.some(id => b.tiles[id].url === url)).name;

test('CSV with a header uses the named columns', async () => {
  const { page, errors } = await openApp(browser);
  const b = await addText(page, 'title,url,note,group\nGit,https://github.com,code,Dev\nPen,codepen.io,,Dev');
  assert.deepEqual(urls(b), ['https://codepen.io', 'https://github.com']);
  assert.equal(tiles(b).find(t => t.url === 'https://github.com').note, 'code');
  assert.equal(groupOf(b, 'https://codepen.io'), 'Dev');
  assert.deepEqual(errors, []);
});

test('CSV without a header needs a link at the start of every line', async () => {
  const { page } = await openApp(browser);
  const b = await addText(page, 'https://a.example,Alpha,first\nhttps://b.example,Beta,second');
  assert.deepEqual(urls(b), ['https://a.example', 'https://b.example']);
  assert.equal(tiles(b).find(t => t.url === 'https://b.example').title, 'Beta');
});

test('a single line with a comma is kept as a note', async () => {
  const { page } = await openApp(browser);
  const b = await addText(page, 'Call the dealer, ask about rollers');
  assert.deepEqual(notes(b), ['Call the dealer, ask about rollers']);
});

test('a comma line followed by links keeps every line', async () => {
  const { page } = await openApp(browser);
  const b = await addText(page, 'Ideas, maybe later\nhttps://github.com\nhttps://codepen.io');
  assert.equal(tiles(b).length, 3);
  assert.deepEqual(notes(b), ['Ideas, maybe later']);
});

test('Markdown checkboxes and links', async () => {
  const { page } = await openApp(browser);
  const b = await addText(page, '- [ ] Finish the site\n- [x] Set up Pages\n[Shader](https://shadertoy.com) - remix it');
  const done = tiles(b).find(t => t.title === 'Set up Pages');
  assert.equal(done.done, true);
  assert.equal(tiles(b).find(t => t.title === 'Finish the site').done, undefined);
  const md = tiles(b).find(t => t.url === 'https://shadertoy.com');
  assert.equal(md.title, 'Shader');
});

test('browser bookmarks HTML: folders become groups', async () => {
  const { page } = await openApp(browser);
  const html = `<!DOCTYPE NETSCAPE-Bookmark-file-1><DL><p>
    <DT><H3>Bookmarks bar</H3><DL><p>
      <DT><H3>Music</H3><DL><p><DT><A HREF="https://bandcamp.com">Bandcamp</A></DL><p>
      <DT><A HREF="https://github.com">GitHub</A>
      <DT><A HREF="javascript:void(0)">Bookmarklet</A>
    </DL><p></DL>`;
  const b = await addFile(page, 'bookmarks.html', html, 'text/html');
  assert.deepEqual(urls(b), ['https://bandcamp.com', 'https://github.com']);
  assert.equal(groupOf(b, 'https://bandcamp.com'), 'Music');
  assert.equal(groupOf(b, 'https://github.com'), 'Ungrouped');
});

test('Chrome Bookmarks JSON', async () => {
  const { page } = await openApp(browser);
  const j = { roots:{ bookmark_bar:{ name:'Bookmarks bar', children:[
    { type:'folder', name:'Tools', children:[{ type:'url', name:'Figma', url:'https://www.figma.com' }] },
    { type:'url', name:'MDN', url:'https://developer.mozilla.org/' } ] } } };
  const b = await addFile(page, 'Bookmarks.json', JSON.stringify(j), 'application/json');
  assert.deepEqual(urls(b), ['https://developer.mozilla.org', 'https://www.figma.com']);
  assert.equal(groupOf(b, 'https://www.figma.com'), 'Tools');
});

test('{ "Group": [...] } JSON', async () => {
  const { page } = await openApp(browser);
  const b = await addFile(page, 'list.json', JSON.stringify({ Reading:['https://a.example', { url:'https://b.example', title:'B' }], Todo:[{ title:'Write intro', done:true }] }), 'application/json');
  assert.equal(groupOf(b, 'https://a.example'), 'Reading');
  assert.equal(tiles(b).find(t => t.title === 'Write intro').done, true);
});

test('a saved web page resolves relative links against its address', async () => {
  const { page } = await openApp(browser);
  const html = '<!-- saved from url=(0025)https://dealer.example/x/ --><html><head><title>Dealer</title></head><body><a href="/a">A</a><a href="b">B</a><a href="#top">top</a><a href="https://other.example/c">C</a></body></html>';
  const b = await addFile(page, 'page.html', html, 'text/html');
  assert.deepEqual(urls(b), ['https://dealer.example/a', 'https://dealer.example/x/b', 'https://other.example/c']);
  assert.equal(groupOf(b, 'https://dealer.example/a'), 'Dealer');
});

test('passwords inside links are stripped', async () => {
  const { page } = await openApp(browser);
  const b = await addText(page, 'https://kyle:hunter2@example.com/private');
  assert.deepEqual(urls(b), ['https://example.com/private']);
});
