---
title: "Bulletproof File Sync Setup for CA Office: Ditching OneDrive Headaches"
summary: Works like magic in seconds with syncthing and Tailscale
time: 1763856000
---

In the world of Chartered Accountancy, the “standard” way to sync files across all laptops and systems is to keep paying for Microsoft 365 and still put up with slow, unreliable OneDrive sync. We faced constant latency, “file in use” conflicts, version mess-ups, and remote staff being completely cut off from the latest client files.

I built a better hybrid setup for our firm using completely free and open-source tools: Syncthing for instant peer-to-peer sync between machines, Tailscale (free tier) for seamless remote access even on 4G, and OneDrive kept only as a disaster-recovery backup from one single machine — so if an earthquake (or anything else) wipes out the entire office, nothing is lost.

Here’s exactly how I set it up, step by step.

## Syncthing – The Sync Engine

Syncthing is the engine that makes everything else possible. It’s an open-source tool that lets all your laptops and desktops share files directly with each other — no Microsoft server in the middle, no waiting for uploads, just instant sync the moment someone saves a ROC document or ITR file. It’s completely free forever, works offline inside the office, and only sends the tiny changed bits of a file instead of the whole thing.

Installation is dead simple and the same on every machine:  
go to https://syncthing.net/downloads/ ,download “Syncthing Windows 64-bit Setup”, run it, and let it finish. It will automatically open a browser tab at http://127.0.0.1:8384. First time only, set a username/password for security and give the device a clear name like “CA-Hareesh-Laptop”, “CA-Sirisha-Desktop”, “Article-Hepsi-PC”, etc. That’s it — Syncthing now runs quietly in the background on every laptop and desktop, waiting for us to tell it which folder to share.

## The Master Folder – C:\ClientDATA

This is the one folder that rules them all.  
We decided everything client-related lives inside a single, clearly named folder: **C:\ClientDATA** (yes, on the C: drive of every single laptop and desktop — no confusion about D:, E:, or some random “Shared Documents” location).

Do this on every machine (takes 10 seconds):

1. Open File Explorer → This PC → right-click on C: drive → New → Folder → name it exactly **ClientDATA**.
2. Inside it, I created a clean structure that every article and partner now follows religiously:

 ```
C:\ClientDATA\
├── Current Year (2025-26)\
│   ├── ITR\
│   ├── GST\
│   ├── Audit\
│   ├── TDS & TCS\
│   └── ROC & MCA\
├── Previous Years\
│   ├── 2024-25\
│   ├── 2023-24\
│   └── 2022-23\
└── Common\
    ├── Templates\
    ├── Checklists\
    └── Office Circulars\
 ```

On the main office desktop (the one that’s always switched on), I first copied all our existing client folders into the right places inside this structure. That became the “golden copy” — everything else will sync from here.

## Sharing & Syncing ClientDATA Across All Devices

Now the fun part — making every laptop see the exact same files instantly.

Do this first on your main office desktop:

1. Open Syncthing → click **Add Folder**
2. Folder Label → “ClientDATA – Full Office Sync”
3. Folder Path → `C:\ClientDATA`
4. Folder ID → copy this long random string (treat it like a password)
5. Under **File Versioning** → choose **Staggered File Versioning** → set:
   - Last 30 days → every change hourly
   - Last 1 year → daily versions
   - Older than 1 year → weekly versions  
   (Perfect for CA work — accidentally deleted an old audit note? We can bring back any version from any date.)

6. Click Save

On every other laptop/desktop:

1. Open Syncthing → Add Folder → paste the exact same Folder ID
2. Path → `C:\ClientDATA`
3. Save

Back on the main desktop you’ll see connection requests → Accept all.

Within seconds (or minutes for the first big sync), every machine has an identical live copy. From now on, any change on any laptop appears on every other machine in 1–3 seconds when in office.

**From now on, anyone creating a file or folder inside C:\ClientDATA — whether it’s a new ITR working, a scanned certificate, or an entire client folder — instantly appears on every single laptop in the firm within seconds.** No “refresh”, no waiting, no shouting across the cabin.

Staggered versioning runs automatically on every device — unlimited undo history without thinking about it.

## Tailscale – For When Someone Works from Home (or Client Site)

Syncthing is lightning-fast when everyone is on the same office WiFi. But take a laptop home or to a client’s factory and the magic stops — because the home router is on a different network.

Tailscale fixes that. It creates a private, encrypted mesh network so every laptop thinks it’s still sitting inside the office — even on Jio 4G in a village. The free plan supports up to 100 devices and 3 admins — more than enough for any CA firm.

Setup:

1. One person creates an account at https://login.tailscale.com (use the firm email).
2. Install Tailscale on every machine → log in → it turns green.
3. In the admin console, rename devices to match Syncthing names.
4. (Optional) Enable MagicDNS.

Done. Now remote laptops sync exactly like they never left the office cabin.

## The Final Safety Net – OneDrive Backup from Just One Machine  
(aka the “What if an earthquake swallows the entire office tomorrow?” plan)

Look, we love living on the edge with peer-to-peer magic, but client data is sacred. One rogue earthquake, one power surge that fries every laptop at once, or one angry monsoon that turns the office into a swimming pool, and poof — years of ITRs, audit files, and TDS workings gone forever. Not happening on my watch.

So we still keep a full off-site backup in OneDrive, but the smart way: **only the main office desktop (the always-on beast with UPS) is allowed to upload**. Every other laptop is banned from touching OneDrive for this folder. No duplicate uploads, no “file in use” drama, no 15 copies of the same Excel fighting each other.

Here’s the lazy-genius version I use:

1. On the main desktop, create a folder inside OneDrive called **“CA Office – Doomsday Backup”**.
2. I wrote the world’s simplest Python script (runs every night at 2 AM via Task Scheduler):

```python
import shutil
from datetime import datetime

source = r"C:\ClientDATA"
dest = r"C:\Users\YourName\OneDrive\CA Office - Doomsday Backup"

print(f"🌙 Nightly backup running → {datetime.now()}")
shutil.copytree(source, dest, dirs_exist_ok=True)
print("✅ All client files safely tucked into OneDrive. Sleep tight!")
```

That’s it. Every change anyone makes anywhere in the firm during the day gets replicated instantly via Syncthing. Then, once everyone’s gone home and snoring, the main desktop quietly mirrors the entire C:\ClientDATA to OneDrive.

If tomorrow morning the earth literally opens up and swallows the office (or some idiot spills chai on the server rack), we just log into OneDrive from a phone, a friend’s laptop, or a cyber café — and every single client file is sitting there, exactly as it was at 2 AM. Disaster-proof, zero extra cost, and zero daily hassle.

Peace of mind tastes better than any paid backup service.

And that’s the complete system — fast, free, remote-friendly, and now officially earthquake-resistant.

Go set it up in your firm. Your future self (and your partners) will thank you.
