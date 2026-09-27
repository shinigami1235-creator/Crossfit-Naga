# CrossFit Naga website

This folder is the whole CrossFit Naga website as plain HTML, CSS and JavaScript. It runs on GitHub Pages with no build step. Open `index.html` through a local server to preview it, since the 3D logo intro loads its files with `fetch` and a double-clicked file blocks that.

    python -m http.server 8000

Then open http://localhost:8000 in a browser.

## Before it goes live

1. Have someone at the gym read the Thai version (press ไทย in the top bar). The Thai names used are แอนนิกา, ฮาคิม, แฮนเซน, ปาล์ม and ส้มเปรี้ยว. Correct any that are spelled differently.
2. Confirm the coach details with each coach. They come from the Instagram introductions posted between November 2024 and September 2025, and FX is listed as CrossFit Level 2 from the crossfit.com gym page.
3. Confirm the prices. They come from the PushPress plans page in September 2026: 5,500, 15,300, 29,400 and 54,000 THB.
4. Confirm the timetable. It comes from the schedule image in the source folder.
5. After the site has its address, change `og:image` in `index.html` to the full URL, for example `https://yourname.github.io/crossfit-naga/img/og.jpg`, since Facebook and LINE ignore a relative path for link previews.

## Where things live

| What | File |
|---|---|
| Page text in English | `index.html` |
| Page text in Thai | `js/i18n.js` |
| Timetable | `js/site.js`, the `WEEK` list |
| Colours, fonts, spacing | `css/site.css`, the `:root` block |
| 3D logo intro | `js/intro.js` and `js/boot-intro.js` |
| Photos | `img/` |
| Videos | `media/` |
| Design rules for future pages | `DESIGN.md` |

## Changing the timetable

Each class is one line in the `WEEK` list in `js/site.js`:

    T(0,'6:30','7:20','Hyrox','hyrox'),

The first number is the day, from 0 for Monday to 6 for Sunday. Then come the start time, the end time, the class name and the filter group. The filter groups are `crossfit`, `hyrox`, `lifting`, `gym`, `kids` and `other`.

## Changing text

Every piece of text with a `data-i18n` name in `index.html` has a Thai version under the same name in `js/i18n.js`. Change both when you change one.

## The logo intro

The intro plays once per browser session. Click, scroll or press any key to skip it. People who turn on reduced motion in their phone or computer settings skip it too. On a browser without WebGL it shows a flat version of the medallion.

## Publishing on GitHub Pages

1. Create a repository and push this folder to it with git. Avoid GitHub's web uploader since it flattens the `img`, `media` and `js` folders.
2. In the repository settings, open Pages and set the source to the main branch, root folder.
3. The site appears at `https://<username>.github.io/<repository>/` after a minute or two.

The videos total about 17 MB, which is within GitHub's limits.
