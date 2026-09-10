# 物尽其分 · Matter Sorted

**Matter Sorted** (中文：物尽其分) is a personal research site documenting the
technology, products, and principles behind multimodal spectral fusion sorting for solid waste — the
technology that lets machines separate materials by fusing RGB, near-infrared,
laser, and X-ray signals, most of which fall outside what the human eye can
see. It is a personal research site written and maintained by Kim.

The site is not a product blog or a how-to manual. Each piece is a short,
paper-style argument about *why* a given layer of the sorting stack evolved
the way it did — what physical, engineering, or economic constraint forced
the design choice, and where that choice stops working.

---

## 1. Subject matter

Sorting systems are treated as a four-layer stack, and every piece of content
is anchored to exactly one layer:

| Layer | English | Concern |
|---|---|---|
| 感知层 | Perception | Can the sensor actually resolve the signal? (RGB / near-infrared / laser / X-ray fusion) |
| 决策层 | Decision | How does a signal become a material classification? |
| 执行层 | Execution | How does a classification become a physical action (grasp / divert)? |
| 运营层 | Operations | Facility-level data flow and feedback loops |

---

## 2. Governing documents

The project is deliberately split into separate specs so that content,
writing quality, visual design, and infrastructure can each evolve — and be
edited by a human or an agent — without stepping on the others.

| Document | Scope | Who edits it |
|---|---|---|
| `WRITING_STANDARD.md` | How a piece is argued: thesis, constraints, evidence, figure captions, video placement, layer classification | Whoever drafts content (human or agent) |
| `CONTENT_GUIDE.md` | The file/folder contract a piece must follow (frontmatter fields, media naming, i18n file naming) | Same as above |
| `DESIGN_GUIDE.md` | Visual system: color (mapped to real spectral bands), typography, layout, component states, motion, a "never do this" list | Only when changing the site's look |
| `ARCHITECTURE.md` | Tech stack choices, directory boundaries, the local → Git → deploy pipeline, extension points | Only when changing infrastructure |
| `DEPLOY.md` | GitHub-driven publishing and optional static hosting on Vercel or Linux | Only when changing hosting |

The rule that matters most: **`content/` is the only directory a content
agent should ever write to.** Everything that controls how the site looks or
runs lives outside it, so repeated content updates can never accidentally
drift the design or break the build.

---

## 3. Stack, in one paragraph

Next.js 15 (App Router), statically exported (`output: 'export'`) so the
build produces plain HTML/CSS/JS deployable to Vercel *or* any Linux box
running Nginx — no Node process needs to stay running. Content lives as
Markdown + frontmatter (`.mdx`), compiled at build time with
`next-mdx-remote`. Two locales (`zh` default, `en` optional per piece) are
generated as static routes; a missing translation falls back to the Chinese
original with a visible notice rather than a 404. Images referenced with
relative paths in content are synced into `public/` by a small build script;
video is never committed to Git — only a link to externally hosted video
(B站 by default) is stored.

---

## 4. Update mechanism, in one paragraph

Content is developed locally through discussion between Kim and an agent,
then written as structured MDX and validated by `scripts/publish-check.js`.
Article work is committed to the `article` branch; site code is developed on
the `code` branch. The `article` branch contains article materials only, while
the `code` branch is the single build and version-iteration branch pushed to
[`Kim-Lou/matter-sorted`](https://github.com/Kim-Lou/matter-sorted.git), which
is the source of truth used by the website build. No CMS or manual file upload
is part of the normal publishing path.

---

## 5. Why this split exists

The site is a durable, citable personal knowledge base about solid-waste sorting.
It is designed for both human readers and software agents: every article has
consistent frontmatter and stable URLs, while `/llms.txt` exposes the content
index and `/llms-full.txt` exposes the complete Markdown corpus. That only
works if the writing stays rigorous (`WRITING_STANDARD.md`),
the presentation stays distinctive rather than templated (`DESIGN_GUIDE.md`),
and updates stay effortless enough to actually happen (`ARCHITECTURE.md` +
`DEPLOY.md`).
