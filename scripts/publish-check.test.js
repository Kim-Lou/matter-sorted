import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const checker = path.resolve('scripts/publish-check.js');
const source = path.resolve('content/notes/2026-09-data-pipeline');
for (const scenario of ['valid', 'wrong-id', 'duplicate-id', 'bad-date', 'old-update', 'bad-revision', 'slug-override', 'stale-translation', 'missing-image']) {
  test(scenario, () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'matter-sorted-check-'));
    try {
      const note = path.join(root, 'content/notes/2026-09-data-pipeline');
      fs.cpSync(source, note, { recursive: true });
      const index = path.join(note, 'index.mdx');
      let text = fs.readFileSync(index, 'utf8');
      if (scenario === 'wrong-id') text = text.replace('id: "2026-09-data-pipeline"', 'id: "another"');
      if (scenario === 'duplicate-id') fs.cpSync(note, path.join(root, 'content/notes/2026-09-second'), { recursive: true });
      if (scenario === 'bad-date') text = text.replace('updated: "2026-09-05"', 'updated: "2026-02-30"');
      if (scenario === 'old-update') text = text.replace('updated: "2026-09-05"', 'updated: "2025-09-05"');
      if (scenario === 'bad-revision') text = text.replace('revision: 1', 'revision: 0');
      if (scenario === 'slug-override') text = text.replace('revision: 1', 'revision: 1\nslug: collision');
      if (scenario === 'stale-translation') fs.writeFileSync(path.join(note, 'index.en.mdx'), text.replace('revision: 1', 'revision: 2'));
      if (scenario === 'missing-image') text += '\n![missing](./missing.png)\n';
      fs.writeFileSync(index, text);
      const result = spawnSync(process.execPath, [checker], { cwd: root, encoding: 'utf8' });
      assert.equal(result.status, scenario === 'valid' ? 0 : 1, result.stdout + result.stderr);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
}
