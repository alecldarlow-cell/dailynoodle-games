# Noodle Games — games.dailynoodle.co.uk

The Daily Noodle's games room, split out of `alecldarlow-cell/dailynoodle` (at 071b999) on 22 Nov 2026 so games can be developed and published on their own, outside the daily puzzle site's test gate.

- Each game is one HTML file in `reports/`, at the same path it had on dailynoodle.co.uk; old links there forward here and carry players' saves (`#dnmove=`, merged by `dn-track.js`).
- Front page: `index.html` + `front.js`/`front.css`, listing `feed.json`. Games badged "In development" show on the front page with their badge.
- Publish: push to `main`. `.github/workflows/build.yml` runs `tools/build.js` (tracker check, link-preview tags, feed) and `tools/check.js`, then deploys `_site` to GitHub Pages.
- Never rename a game's save key or file path: players' progress depends on them.
- Borderline, Ballpark and Yarn stand alone: they no longer read the daily puzzles' saves (different address). Their "today's puzzle" card links to dailynoodle.co.uk.
- Astro Drop is no longer on the Leagues board.
