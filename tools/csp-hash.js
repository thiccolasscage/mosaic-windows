// Updates the script hash in index.html's Content-Security-Policy after the inline script changes.
// Run: node tools/csp-hash.js   (the tests fail if this was forgotten)
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const file = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(file, 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) throw new Error('No inline <script> found in index.html');
const hash = 'sha256-' + crypto.createHash('sha256').update(m[1], 'utf8').digest('base64');
const out = html.replace(/'sha256-[^']*'/, `'${hash}'`);
if (process.argv.includes('--check')){ if (out !== html){ console.error('CSP hash is stale: run node tools/csp-hash.js'); process.exit(1); } console.log('CSP hash ok'); }
else { fs.writeFileSync(file, out); console.log(hash); }
