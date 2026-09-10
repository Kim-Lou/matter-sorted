# matter-sorted article branch

This branch stores article materials only.

Allowed contents:

- `content/notes/<slug>/index.mdx`
- article images such as `cover.jpg` and `fig-01.png`
- optional article link files such as `video.url`

Do not commit site code here. Keep `app/`, `components/`, `lib/`, `scripts/`,
`package.json`, lockfiles, build config, and deployment config on the `code`
branch.

After an article is reviewed, copy the approved `content/notes/<slug>/`
directory into the `code` branch for build and publishing.
