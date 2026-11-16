# 🎮 KingTrap – LAN Multiplayer

**KingTrap** is a multiplayer video game developed using JavaScript and web technologies. The game focuses on traps, interactive gameplay mechanics, and competition between players.

The project features a client-server architecture that allows multiple players to connect and play together over a Local Area Network (LAN).

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Project Goals](#-project-goals)
- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Project Architecture](#-project-architecture)
- [Installation](#-installation)
- [Running the Game](#-running-the-game)
- [LAN Multiplayer](#-lan-multiplayer)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Future Improvements](#-future-improvements)
- [Author](#-author)
- [License](#-license)

---

## 🎯 Project Overview

KingTrap is a browser-based multiplayer game built with JavaScript and modern web technologies.

The main concept revolves around gameplay challenges, traps, and interactions between players.

The project uses JavaScript to manage the game logic, player interactions, game states, and gameplay mechanics.

It also includes a multiplayer system that allows multiple players to connect to the same game through a local network.

## 🚀 Project Goals

The main objectives of KingTrap are:

- Develop an interactive video game using JavaScript.
- Implement a multiplayer system.
- Enable communication between multiple clients.
- Build a client-server architecture.
- Organize the source code into independent modules.
- Improve game performance and stability.
- Provide an accessible gaming experience through a web browser.

---

## ⚙️ Features

### 🎮 Gameplay

- Main game logic management.
- Game state and event management.
- Level management system.
- Player interactions with game elements.
- Game object construction and management.

### 🌐 Multiplayer System

- Client-server architecture.
- Multiple player connections.
- Communication between the server and clients.
- Multiplayer session and game state management.
- Local Area Network (LAN) support.

### 👤 Authentication and Data Management

- Authentication module.
- Player information management.
- Game data and state management.

### 🛠️ User Interface

- HTML-based interface.
- JavaScript-powered interactions.
- In-game information display.
- Visual elements and user event management.

---

## 💻 Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | User interface structure |
| CSS | Visual presentation |
| JavaScript | Game logic and functionality |
| Node.js | Server-side execution |
| npm | Dependency management |
| Git | Version control |
| GitHub | Source code hosting |

---

## 📁 Project Architecture

The project is organized into multiple JavaScript modules, each responsible for a specific part of the game.

```text
Kingtrap/
│
├── node_modules/          # Installed dependencies
│
├── auth.js                # Authentication
├── builder.js             # Game object construction
├── constants.js           # Project constants
├── engine.js              # Main game engine and logic
├── index.html             # Main game interface
├── levels.js              # Level management
├── multiplayer.js         # Multiplayer functionality
├── server.js              # Game server
├── state.js               # Game state management
├── store.js               # Data management
├── ui.js                  # User interface and interactions
│
├── package.json           # Project configuration
├── package-lock.json      # Dependency lock file
├── MULTIPLAYER-README.txt # Multiplayer documentation
│
├── .gitignore             # Git ignored files
└── README.md              # Main documentation
```

---

## 📥 Installation

### 1. Requirements

Before installing the project, make sure you have:

- [Node.js](https://nodejs.org/) installed.
- npm (included with Node.js).
- Git installed (optional, for cloning the repository).
- A modern web browser.

### 2. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/JoeAzar1/New-TrapKing.git
```

### 3. Navigate to the Project Folder

```bash
cd New-TrapKing
```

### 4. Install Dependencies

```bash
npm install
```

This command installs the dependencies listed in `package.json`.

---

## ▶️ Running the Game

After installing the dependencies, start the server using the appropriate script defined in `package.json`.

For example:

```bash
npm start
```

If no `start` script is configured, check the available scripts:

```bash
npm run
```

You can also start the server directly if the project is configured for it:

```bash
node server.js
```

Open your browser and navigate to the local address displayed by the server.

---

## 🌐 LAN Multiplayer

KingTrap includes a multiplayer architecture designed for Local Area Network gameplay.

The objective is to allow multiple players connected to the same local network to join a shared game session.

### How to Connect

1. Start the game server on the host computer.
2. Make sure all players are connected to the same local network.
3. Find the host computer's local IP address.
4. Allow the game server through the host computer's firewall if necessary.
5. On other computers, open a browser.
6. Enter the host computer's IP address and the server port.

Example:

```text
http://192.168.1.100:3000
```

**Note:** The IP address and port above are examples. Use the actual address and port configured by the server.

---

## 🧩 Development

KingTrap is structured using modular JavaScript files to make development, maintenance, and debugging easier.

Each module has a specific responsibility:

| File | Description |
|---|---|
| `auth.js` | Authentication logic |
| `builder.js` | Game construction tools |
| `constants.js` | Shared constants |
| `engine.js` | Main game engine |
| `levels.js` | Level and stage management |
| `multiplayer.js` | Multiplayer communication |
| `server.js` | Server-side functionality |
| `state.js` | Game state management |
| `store.js` | Data storage and management |
| `ui.js` | User interface management |

---

## 🔮 Future Improvements

Potential areas for future development include:

- Additional levels and challenges.
- New traps and gameplay mechanics.
- Improved multiplayer synchronization.
- Better player management.
- Improved user interface and visual effects.
- Performance optimization.
- Additional game modes.
- Online multiplayer support beyond local networks.

---

## 👨‍💻 Author

**Joe Azar**

Developer and creator of KingTrap.

- GitHub: [@JoeAzar1](https://github.com/JoeAzar1)
- Project Repository: [New-TrapKing](https://github.com/JoeAzar1/New-TrapKing)

---

## 📜 License

This project is distributed under the license included in the repository.

See the [LICENSE](LICENSE) file for more information.

---

⭐ If you find this project interesting, consider giving the repository a star on GitHub!

**KingTrap – Play, Build, Survive!**
