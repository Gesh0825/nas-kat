# Nas Kat

Photo-based calorie, treadmill and weight-goal tracker. Runs entirely in the browser — no backend, no build step. Data is stored on-device (localStorage).

## What's in this folder

```
index.html          the whole app
manifest.json        PWA manifest (name, icons, colors)
sw.js                 service worker (lets it work offline / installed)
icons/                app icons (192, 512, apple touch icon, favicon)
worker.js             the scan proxy — deployed to Cloudflare, not GitHub
```

## 1. The scan proxy is already set up

The photo-scanning feature calls Google's Gemini API to read each meal photo. Earlier versions of this app kept the API key directly in `index.html` — but because the GitHub repo has to be public for free GitHub Pages, Google's own security scanner (and GitHub's) finds and kills any key it sees sitting in a public repo, usually within minutes to hours. That's why the scan feature kept breaking.

The fix: the key now lives in a small free proxy (a Cloudflare Worker), already deployed at `https://dark-sound-327dnaskat.gesh-katoorah.workers.dev/` and already wired into `index.html` via `SCAN_PROXY_URL`. The Worker calls Gemini using a secret key stored only in Cloudflare's own settings — never in this repo — so nothing here for GitHub or Google's scanners to find and revoke.

`worker.js` (included in this folder for reference) is the code running on that Worker. It never needs to go into the GitHub repo — it only lives on Cloudflare. If the Gemini key ever needs rotating, that happens entirely inside the Worker's **Settings → Variables and Secrets** on the Cloudflare dashboard — no code changes, no redeploying to GitHub needed.

## 2. Deploy to GitHub Pages (5 minutes)

1. Go to https://github.com/new and create a new repository, e.g. `nas-kat`. Public repo (Pages needs public unless you're on GitHub Pro/Team).
2. On your computer, unzip this package, then from inside the `naskat` folder run:
   ```
   git init
   git add .
   git commit -m "Nas Kat app"
   git branch -M main
   git remote add origin https://github.com/Gesh0825/nas-kat.git
   git push -u origin main
   ```
   (No git installed / don't want to use the terminal? On the new repo's GitHub page, click "uploading an existing file" and drag in all the files/folders from this package instead.)
3. On GitHub, open the repo → **Settings** → **Pages** (left sidebar).
4. Under "Build and deployment" → Source: **Deploy from a branch**. Branch: **main**, folder: **/ (root)**. Save.
5. Wait ~1 minute, then refresh that Settings → Pages screen. It'll show your live URL:
   `https://gesh0825.github.io/nas-kat/`

That link is the app — fully working, key and all. Share it with your wife.

## 3. Add to iPhone home screen (proper app icon, no Safari address bar)

1. Open the GitHub Pages link **in Safari** on the iPhone (must be Safari, not Chrome).
2. Tap the Share icon (square with an arrow) → **Add to Home Screen**.
3. It'll show the Nas Kat icon and name — tap **Add**.
4. Launch it from the home screen icon from now on — it opens full-screen, no browser chrome, with the Nas Kat icon, because it's now a real top-level page instead of being loaded inside anything else.

## 4. First-time setup in the app

Open **Profile** and fill in:
- Current weight, height, age, sex, activity level → used for BMR/TDEE
- Goal weight + target date → used for the progress tracker

Then start logging meals (Camera tab) and treadmill sessions (Exercise tab). The Home tab shows the daily calories-in vs calories-burned summary and net deficit/surplus.

## Updating the app later

Edit the files, then from inside the folder:
```
git add .
git commit -m "update"
git push
```
GitHub Pages redeploys automatically in under a minute.
