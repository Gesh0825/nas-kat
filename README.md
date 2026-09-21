# Nas Kat

Photo-based calorie, treadmill and weight-goal tracker. Runs entirely in the browser — no backend, no build step. Data is stored on-device (localStorage).

## What's in this folder

```
index.html          the whole app
manifest.json        PWA manifest (name, icons, colors)
sw.js                 service worker (lets it work offline / installed)
icons/                app icons (192, 512, apple touch icon, favicon)
```

## 1. Get a free Gemini API key and add it to the app (do this first)

The app calls Google's Gemini API directly from the browser to read each meal photo. It's baked into the code once by you — your wife never sees or enters a key, she just opens the app.

1. Go to https://aistudio.google.com/apikey → sign in with any Google account.
2. Click **Create API key**. Copy it (starts with `AIza...`).
3. Open `index.html` in a text editor. Near the very top of the `<script>` section you'll see:
   ```js
   const GEMINI_API_KEY = 'PASTE_YOUR_GEMINI_API_KEY_HERE';
   ```
   Replace `PASTE_YOUR_GEMINI_API_KEY_HERE` with your real key (keep the quotes), then save.

That's it — free, no card, nothing to top up. One honest tradeoff: because this key lives in the page's own code and the repo has to be public for free GitHub Pages, anyone who looks at "View Page Source" on the deployed site could see and copy it. For a private key with no billing attached that's a low-stakes risk (worst case, someone else eats into the free daily quota) — but don't reuse this same key anywhere with billing enabled, and if it's ever exposed, delete it and generate a new one at the same link.

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
