# Muhammad Anas Kamran · Engineering Portfolio

Live site: **https://muhammadanaskamran.github.io/engineering-portfolio/**

A hand-built static site (plain HTML, CSS and JavaScript, no frameworks or
build step) hosted on GitHub Pages. Pushing to the `main` branch publishes it
automatically in about a minute.

---

## Folder guide

```
index.html            The page shell (title, link previews, security policy)
content.js            ← ALL text, links, logos and photos. Edit this to change content.
css/styles.css        Design: colours, layout, animations
js/main.js            Behaviour: builds the page from content.js, Read more, video, tilt, etc.
assets/
  logos/              PolyU, EEE, ASTRI, CLP and Outlook logos
  projects/           Project photos (web-ready, enhanced)
  video/              Demo video (MP4)
  cursor/             Custom cursor (1x + 2x)
  meta/               Favicons and the link-preview image (share.jpg)
tools/
  enhance_images.py   Re-creates the web photos from your originals
  cursor.svg          Source drawing of the cursor
source-images/        Your original photos and video (local only, not uploaded)
  comparisons/        Before/after sheets from the photo enhancement
notes/                Your original project-bank document (local only)
```

`source-images/`, `notes/` and `.claude/` are listed in `.gitignore`, so they
never reach GitHub.

---

## Common updates

### Change any text (headline, project details, dates, skills)
Edit `content.js`. Each project has the same fields:

| Field | Shown as |
|---|---|
| `name` | Project title |
| `description` | One-line subtitle under the title |
| `role`, `dates`, `organization` | Header next to the logo |
| `skills` | Grey skill pills |
| `problem`, `myRole` | "The problem" / "My role" (leave `myRole` as `null` to hide it) |
| `insights` | "Key insight(s)": a list of `{ "title", "body" }` |
| `outcome` | The dark Outcome card |
| `logo` | One of the keys in `logos` at the top of the file |
| `media` | Photos / video, see below |

### Add or replace a photo
1. Put the original in `source-images/`, named after the project id, e.g.
   `gpu-immersion-cooling.jpg` (use `-1`, `-2` for several photos).
2. Run the enhancement (denoise, colour-correct, upscale, sharpen):
   ```bash
   python3 tools/enhance_images.py
   ```
3. In `content.js`, add or update the item in that project's `media.items`:
   `{ "src": "assets/projects/<file>.jpg?v=1", "alt": "What the photo shows", "position": "50% 50%" }`
   - `position` is the focus point used when the photo is cropped (x% y%).
   - Raise the `?v=` number whenever you replace a file that has the same name.

### Add a whole new project
Copy an existing project block in `content.js`, give it a new unique `id`
(lowercase-with-dashes) and fill in the fields. It appears automatically
with the same layout, animations and Read more.

---

## Publishing changes

From this folder:

```bash
git add -A
git commit -m "Describe your change"
git push
```

The site updates within about a minute. **If you changed `content.js`,
`css/styles.css` or `js/main.js`**, also raise all three version numbers in
`index.html` (e.g. `?v=39` → `?v=40`) so visitors' browsers fetch the new
files instead of cached ones. This one command does it (macOS):

```bash
sed -i '' 's/?v=39/?v=40/g' index.html
```

### Preview locally before publishing
```bash
python3 -m http.server 8080
```
then open http://localhost:8080

---

## Security notes

- A Content Security Policy in `index.html` only lets the site's own scripts,
  images and video load. If you ever add something from another website
  (e.g. an embedded video or font), it must be allowed there or it will be blocked.
- The page refuses to be embedded inside other sites (clickjacking guard).
- The email address is stored in two parts in `content.js` to avoid simple
  spam scrapers.
- Keep two-factor authentication on your GitHub account. It's what really
  protects the site.

© Muhammad Anas Kamran. All rights reserved.
