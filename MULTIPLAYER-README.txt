KING TRAP — LOCAL WI-FI MULTIPLAYER EDITION
==========================================

WHAT IS INCLUDED
- Competitive mode: the first player to reach the goal wins.
- Cooperative mode: the team wins after every connected player reaches the goal.
- Private rooms with a 5-character room code.
- Up to 4 players per room.
- Any player can create a room; the room creator is the host and chooses the level.
- Live player position sharing over your local Wi-Fi network.

NETWORK REQUIREMENT
All players must be connected to the SAME Wi-Fi/LAN network. This version is not designed
for players in different homes or on different networks. No public hosting service is needed.
The Wi-Fi router must allow devices to communicate with each other. A guest Wi-Fi network or
router setting called AP/client isolation may block device-to-device connections.

START A GAME (HOST COMPUTER — WINDOWS)
1. Install Node.js LTS from https://nodejs.org/ (the installer includes npm).
2. Extract this ZIP.
3. Open the extracted Kingtrap folder.
4. In File Explorer, click the address bar, type cmd, and press Enter.
5. Run:
       npm install
       npm start
6. Keep this terminal window open while you play. The server listens on all network interfaces
   (0.0.0.0) on port 3000.
7. Find the host computer's local IPv4 address by running:
       ipconfig
   Under the active Wi-Fi adapter, find the IPv4 Address, for example 192.168.1.25.
8. On the host computer, open http://localhost:3000.

JOIN FROM THE OTHER COMPUTER
1. Connect the second computer to the SAME Wi-Fi network.
2. Open a browser and enter the host's address, for example:
       http://192.168.1.25:3000
   Replace 192.168.1.25 with the host computer's actual IPv4 address.
3. One player creates a room; the other enters its 5-character room code.
4. The host chooses the level and starts the match. Up to 4 players can join.

WINDOWS FIREWALL
If the second computer cannot open the host address, Windows may be blocking incoming traffic.
On the host PC, set the connected Wi-Fi network to Private in Windows Settings > Network & internet
> Wi-Fi > your connected network > Network profile type > Private.
Then open Windows Terminal or Command Prompt as Administrator and run:
       netsh advfirewall firewall add rule name="King Trap LAN 3000" dir=in action=allow protocol=TCP localport=3000 profile=private
Only add this rule on a trusted private network. To remove it later, run:
       netsh advfirewall firewall delete rule name="King Trap LAN 3000"

IMPORTANT LIMITATION
The server manages rooms, player presence, position relays and match results. Physics and trap
collision are still simulated separately on each browser. This is an early multiplayer build,
not a cheat-proof competitive release.

EXISTING ACCOUNTS
Sign-in and progression remain browser-local (localStorage). Usernames are labels, not verified
online identities. Each computer has its own local account/progression data.

TROUBLESHOOTING
- "Online service unavailable": do not open index.html directly; run npm start and visit
  http://localhost:3000 on the host computer.
- "Could not reach the LAN host": check that npm start is still running, both devices use the same
  Wi-Fi, the host URL uses the correct IPv4 address, and the Windows Firewall rule is active.
- If devices still cannot connect, check that the router does not enable AP/client isolation.
- Room code not found: make sure both players use the exact current code and the host has not left.
- A room supports at most 4 connected players.

FILES ADDED
- server.js: Node.js + Express + Socket.IO room server (listens on 0.0.0.0 for LAN access).
- multiplayer.js: browser multiplayer UI and network client.
- package.json: server dependencies and start command.

FILES UPDATED
- index.html: Wi-Fi Multiplayer screen and menu entry.
- engine.js: sends local player positions, draws remote players and handles online finishes.
