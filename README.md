# THE LAST SIGNAL

**A web‑based interactive mystery investigation game**

Open `index.html` in any modern browser to start the detective experience, or deploy the static site to Vercel for a public URL.

## Quick start (local)
```bash
# Clone the repo (if you haven't already)
git clone https://github.com/Dayyansiddiqui103/mystery-game.git
cd mystery-game
# Open directly – no server required
start index.html   # Windows
# Or run a simple static server for live reload
python -m http.server 8080
```

## Deploy to Vercel (one‑click)
1. In the Vercel dashboard click **New Project → Import Git Repository**.
2. Select this repository.
3. Choose **Other** as the framework preset.
4. Leave **Build Command** empty and **Output Directory** as `.`.
5. Click **Deploy** – Vercel will serve `index.html` at `https://<your‑project>.vercel.app`.

## Project structure
```
/assets/                # Image assets (suspect portraits, UI icons)
/index.html              # Main entry point
/styles.css             # Dark, glass‑morphism UI stylesheet
/js/
   data.js              # Game data (locations, clues, suspects)
   audio.js            # Ambient sound engine
   puzzles.js          # Mini‑game logic (keypad, Caesar cipher, UV scanner)
   interrogation.js   # Suspect interrogation mechanics
   evidence-board.js  # Evidence‑board graph rendering
   game.js             # Core engine & UI bindings
vercel.json            # Vercel rewrite config for SPA routing
.gitignore             # Excludes node_modules, IDE files, etc.
```

---
Enjoy the investigation and feel free to customize the story, clues, or UI! 🎭
