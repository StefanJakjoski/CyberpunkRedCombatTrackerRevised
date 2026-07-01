# CyberpunkRedCombatTrackerRevised

A full-stack web application for tracking combat/game data, built with:

- Frontend: Angular
- Backend: Node.js + Express
- Database: MongoDB
- Deployment: Docker + Docker Compose

This project is fully containerized and requires **only Docker** to run.

## Quick Start

### Prerequisites

Make sure you have:

- Docker Desktop installed  
  https://www.docker.com/products/docker-desktop/

- Docker Compose (included with Docker Desktop v2+)

Verify installation:

```bash
docker --version
docker compose version
```

### Run the app

- Clone this repository
```bash
git clone https://github.com/StefanJakjoski/CyberpunkRedCombatTrackerRevised.git
cd CyberpunkRedCombatTrackerRevised
```
  OR manually through the website.

- Start everything
```bash
sudo docker compose up --build
```

  OR run either *start.sh* (on Linux/Mac) or *start.bat* (on Windows) with administrator privileges.

- Open in browser at http://localhost:4200

- Account creation 
  This part is a carryover from the online hosting portion of the program. It has no authentication so feel free to invent emails and usernames on a whim. It doesn't check :)

## Collaborators and credit

Thanks to Tadej Hristov for designing all icons used.
Status/Injury icons taken from Reddit user evr- from a post made on the official r/cyberpunkred subreddit.
For information on the background images, please read the legal disclaimer.

## Legal Disclaimer

I have (close to) no idea how up-to-snuff this is with the R. Talsorian public license. Forward any such complaints to my email.
The tracker is based off and uses mechanics from Cyberpunk Red as published by R. Talsorian Games. The Samurai band logo is used in the tracker (currently as a placeholder).
Absolutely none of the background images are public domain (whoops) and they will all be replaced shortly. I thank any relevant parties for their patience.
## To-Do
### high priority
 - ~~localized version (likely separate branch, hosting and backend setup through docker, local db which can be downloaded, no login)~~
 - ~~add debuffs and crit tables~~
 - ~~add random dice roller (bottom right corner, there for anything dice related)~~

### medium priority
 - ~~add separate icons (single menu that brings up different ones, maybe separate db for images if hosted)~~
 - include separate icons when available
 - include non-injury statuses (grappled, broken weapon, unconscious, drugged, on fire, etc...)
 - ~~change underlay to outline for turn order~~
 - separate players and and mooks (color coded outlines or whatever)
 - Add import option for predefined mooks (players included)
 - Add separate tag for whether a character is a player (there for sorting during imports)

### low priority
 - add flair to weapons (font change, add name customization, add additional notes portion, etc...)
 - ~~add flair to text (change stat text to icons, make icon numbers rewritable, remove "Set" buttons on right)~~
 - ~~Acronymize/shorten gun text (VH Pistol, H Pistol, M Pistol, Weapon Damage -> Damage, Weapon Skill -> Skill)~~
 - color code session logs (separate different events in log template and color code afterwards)
