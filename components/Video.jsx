import fs from 'node:fs';
import path from 'node:path';

// url prop points to a .url file (one line of text: the video link).
// This keeps video files out of git — only the link is versioned.
export default function Video({ url, notePath }) {
  let href = url;
  try {
    if (notePath) {
      const filePath = path.join(process.cwd(), 'content', 'notes', notePath, url.replace('./', ''));
      href = fs.readFileSync(filePath, 'utf-8').trim();
    }
  } catch (e) {
    // fall back to raw url string if read fails
  }

  return (
    <div style={{ margin: '32px 0' }}>
      <div
        style={{
          position: 'relative',
          paddingTop: '56.25%',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        <iframe
          src={href}
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </div>
    </div>
  );
}
