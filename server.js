// KING TRAP multiplayer server — Node.js + Socket.IO
// Server-authoritative room membership and match results; game physics remain client-simulated.
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: true }, maxHttpBufferSize: 1e6 });

app.use(express.static(__dirname));
app.get('/health', (_req,res) => res.json({ ok:true, game:'King Trap' }));

const rooms = new Map();
const MAX_PLAYERS = 4;
const COLORS = ['#33aaff','#ffcc33','#bb66ff','#33dd99'];
const cleanName = n => String(n || 'Player').replace(/[^a-zA-Z0-9_ -]/g,'').trim().slice(0,20) || 'Player';
function code() {
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c;
  do { c=Array.from({length:5},()=>chars[Math.floor(Math.random()*chars.length)]).join(''); } while(rooms.has(c));
  return c;
}
function publicPlayers(room) {
  const out={};
  [...room.players.entries()].forEach(([id,p])=>out[id]={name:p.name,host:id===room.hostId,color:p.color,finished:p.finished});
  return out;
}
function broadcast(room) {
  io.to(room.code).emit('room:update',{players:publicPlayers(room),hostId:room.hostId,mode:room.mode});
}
function leaveRoom(socket) {
  const roomCode=socket.data.roomCode;
  if(!roomCode) return;
  const room=rooms.get(roomCode);
  socket.leave(roomCode); socket.data.roomCode=null;
  if(!room) return;
  room.players.delete(socket.id);
  if(room.players.size===0) { rooms.delete(roomCode); return; }
  if(room.hostId===socket.id) room.hostId=room.players.keys().next().value;
  broadcast(room);
}
io.on('connection', socket => {
  socket.on('room:create', payload => {
    leaveRoom(socket);
    const roomCode=code();
    const room={code:roomCode,hostId:socket.id,mode:payload?.mode==='cooperative'?'cooperative':'competitive',players:new Map(),started:false,finished:new Set()};
    room.players.set(socket.id,{name:cleanName(payload?.name),color:COLORS[0],finished:false});
    rooms.set(roomCode,room); socket.data.roomCode=roomCode; socket.join(roomCode);
    socket.emit('room:joined',{code:roomCode,hostId:room.hostId,mode:room.mode,players:publicPlayers(room)});
  });
  socket.on('room:join', payload => {
    const room=rooms.get(String(payload?.code||'').toUpperCase());
    if(!room) return socket.emit('room:error','Room not found. Check the code and try again.');
    if(room.started) return socket.emit('room:error','This match has already started.');
    if(room.players.size>=MAX_PLAYERS) return socket.emit('room:error','This room is full (maximum 4 players).');
    leaveRoom(socket);
    const color=COLORS[room.players.size%COLORS.length];
    room.players.set(socket.id,{name:cleanName(payload?.name),color,finished:false});
    socket.data.roomCode=room.code; socket.join(room.code);
    socket.emit('room:joined',{code:room.code,hostId:room.hostId,mode:room.mode,players:publicPlayers(room)});
    broadcast(room);
  });
  socket.on('room:leave',()=>leaveRoom(socket));
  socket.on('match:start',payload=>{
    const room=rooms.get(socket.data.roomCode);
    if(!room || room.hostId!==socket.id || room.started) return;
    const level=payload?.level;
    if(!level || !Array.isArray(level.map) || level.map.length!==14 || !Number.isInteger(payload.levelIndex)) return socket.emit('room:error','Invalid level data.');
    room.started=true; room.mode=payload.mode==='cooperative'?'cooperative':'competitive';
    room.levelIndex=payload.levelIndex; room.finished.clear();
    room.players.forEach(p=>p.finished=false);
    io.to(room.code).emit('match:start',{levelIndex:payload.levelIndex,level,mode:room.mode,players:publicPlayers(room)});
  });
  socket.on('player:state',payload=>{
    const room=rooms.get(socket.data.roomCode);
    if(!room?.started || !room.players.has(socket.id)) return;
    const x=Number(payload?.x), y=Number(payload?.y);
    if(!Number.isFinite(x)||!Number.isFinite(y)||Math.abs(x)>2000||Math.abs(y)>2000) return;
    const p=room.players.get(socket.id);
    io.to(room.code).except(socket.id).emit('player:state',{id:socket.id,name:p.name,color:p.color,x,y,alive:payload.alive!==false});
  });
  socket.on('player:finished',()=>{
    const room=rooms.get(socket.data.roomCode);
    if(!room?.started || room.finished.has(socket.id)) return;
    room.finished.add(socket.id);
    const p=room.players.get(socket.id); if(p) p.finished=true;
    const total=room.players.size, count=room.finished.size;
    if(room.mode==='competitive') {
      const message=`${p?.name||'A player'} won the race! (${count}/${total} finished)`;
      io.to(room.code).emit('match:result',{message,winner:socket.id});
      room.started=false;
    } else if(count===total) {
      io.to(room.code).emit('match:result',{message:'TEAM VICTORY! Everyone reached the goal.'});
      room.started=false;
    } else {
      io.to(room.code).emit('match:result',{message:`${p?.name||'A player'} reached the goal. ${count}/${total} players finished.`});
    }
    broadcast(room);
  });
  socket.on('disconnect',()=>leaveRoom(socket));
});
const PORT=process.env.PORT||3000;
server.listen(PORT,'0.0.0.0',()=>console.log(`King Trap online server listening on port ${PORT}`));
