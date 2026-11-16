// KING TRAP — online multiplayer client
// Connects to the Socket.IO server shipped in server.js. Rooms support up to 4 players.
const KTOnline = {
  socket: null, room: null, isHost: false, mode: 'competitive',
  players: {}, active: false, finished: false, lastSend: 0,
  connect() {
    if (this.socket?.connected) return;
    if (typeof io !== 'function') {
      this.status('Online service unavailable. Open the game through the Node server, not as a file.');
      return;
    }
    this.socket = io({ transports: ['websocket', 'polling'] });
    this.socket.on('connect', () => this.status('Connected. Create a room or enter your friend’s code.'));
    this.socket.on('connect_error', () => this.status('Could not reach the LAN host. Check the host PC, Wi-Fi and Windows Firewall.'));
    this.socket.on('disconnect', () => this.status('Disconnected from server. Trying to reconnect…'));
    this.socket.on('room:joined', data => {
      this.room = data.code; this.isHost = data.hostId === this.socket.id;
      this.mode = data.mode; this.players = data.players || {};
      const modeSelect=document.getElementById('mpMode'); if(modeSelect) modeSelect.value=data.mode;
      this.renderRoom();
      this.status(`Room ${data.code} · ${this.mode.toUpperCase()} · Share this code with players on the same Wi-Fi network.`);
    });
    this.socket.on('room:update', data => {
      this.players = data.players || {}; this.isHost = data.hostId === this.socket.id;
      this.renderRoom();
    });
    this.socket.on('room:error', msg => this.status(msg));
    this.socket.on('match:start', data => {
      this.active = true; this.finished = false; this.mode = data.mode;
      this.players = data.players || {};
      const def = data.level;
      if (!def || !Array.isArray(def.map)) { this.status('Host sent an invalid level.'); return; }
      document.getElementById('multiplayerScreen').classList.add('hidden');
      document.getElementById('currencyBar').style.display = 'none';
      document.getElementById('game-wrap').classList.add('active');
      startLevel(data.levelIndex || 0, def, true);
      this.status('');
    });
    this.socket.on('player:state', data => {
      if (!data || data.id === this.socket.id) return;
      this.players[data.id] = { ...(this.players[data.id] || {}), ...data };
    });
    this.socket.on('match:result', data => {
      const message = data.message || 'Match update.';
      this.status(message);
      if (message.includes('won the race') || message.includes('TEAM VICTORY')) {
        this.active = false; stopGame();
        document.getElementById('winMsg').textContent = message;
        document.getElementById('winReward').textContent = 'ONLINE MATCH';
        document.getElementById('winModal').classList.remove('hidden');
      } else if (this.finished) {
        document.getElementById('winMsg').textContent = message;
      }
    });
    this.socket.on('room:closed', () => {
      this.room = null; this.active = false; this.players = {};
      this.status('The host closed the room.');
    });
  },
  status(msg) { const el=document.getElementById('mpStatus'); if(el) el.textContent=msg; },
  renderRoom() {
    const el=document.getElementById('mpPlayers'); if(!el) return;
    const entries=Object.values(this.players);
    el.innerHTML='<div style="margin-top:10px;color:#33ff88;">PLAYERS ('+entries.length+'/4)</div>'+
      entries.map(p=>`<div>• ${String(p.name||'Player').replace(/[&<>"]/g,'')} ${p.host?'[HOST]':''}</div>`).join('');
    const start=document.getElementById('mpStartBtn');
    if(start) start.style.display=this.isHost && entries.length>=1 ? 'block':'none';
  },
  sendState(player) {
    if (!this.active || !this.socket?.connected || !player) return;
    const now=performance.now(); if(now-this.lastSend<50) return; this.lastSend=now;
    this.socket.emit('player:state',{x:player.x,y:player.y,alive:player.alive});
  },
  draw(ctx) {
    if(!this.active) return;
    Object.entries(this.players).forEach(([id,p])=>{
      if(id===this.socket?.id || typeof p.x!=='number' || typeof p.y!=='number') return;
      const color=p.color||'#33aaff';
      ctx.globalAlpha=p.alive===false?0.35:1;
      ctx.fillStyle=color; ctx.fillRect(p.x,p.y,24,30);
      ctx.fillStyle='rgba(255,255,255,.9)'; ctx.font='10px Courier New';
      ctx.fillText(String(p.name||'PLAYER').slice(0,14),p.x-8,p.y-7);
      ctx.globalAlpha=1;
    });
  },
  finish() {
    if(!this.active || this.finished) return false;
    this.finished=true;
    this.socket.emit('player:finished');
    return true;
  },
  leave() {
    if(this.socket?.connected && this.room) this.socket.emit('room:leave');
    this.room=null; this.active=false; this.finished=false; this.players={}; this.isHost=false;
  }
};
function showMultiplayer() {
  _hideAll();
  document.getElementById('multiplayerScreen').classList.remove('hidden');
  _showCurrency();
  const sel=document.getElementById('mpLevel');
  if(sel && !sel.options.length) LEVELS.forEach((l,i)=>{const o=document.createElement('option');o.value=i;o.textContent=(i+1)+'. '+l.name+' ['+l.diff+']';sel.appendChild(o);});
  KTOnline.connect();
}
function mpCreateRoom() {
  KTOnline.connect();
  if(!KTOnline.socket) return;
  const send=()=>KTOnline.socket.emit('room:create',{name:STATE.username||'Player',mode:document.getElementById('mpMode').value});
  if(KTOnline.socket.connected) send(); else KTOnline.socket.once('connect',send);
}
function mpJoinRoom() {
  KTOnline.connect();
  const code=document.getElementById('mpRoomCode').value.trim().toUpperCase();
  if(!/^[A-Z0-9]{5,6}$/.test(code)){KTOnline.status('Enter a valid 5–6 character room code.');return;}
  const send=()=>KTOnline.socket.emit('room:join',{code,name:STATE.username||'Player'});
  if(KTOnline.socket.connected) send(); else KTOnline.socket.once('connect',send);
}
function mpStartGame() {
  if(!KTOnline.isHost || !KTOnline.room) return;
  const index=Number(document.getElementById('mpLevel').value)||0;
  KTOnline.socket.emit('match:start',{levelIndex:index,level:LEVELS[index],mode:document.getElementById('mpMode').value});
}

function mpLeaveAndMenu() {
  KTOnline.leave();
  showMenu();
}
