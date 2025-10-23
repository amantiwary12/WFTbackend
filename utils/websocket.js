import { WebSocketServer } from 'ws';
// import { BACKEND_URL } from '../config/env.js';

let wss;

export const createWebSocketServer = (server) => {
  wss = new WebSocketServer({ server });
  
  wss.on('connection', (ws) => {
    console.log('✅ New client connected to WebSocket');
    
    ws.on('close', () => {
      console.log('❌ Client disconnected from WebSocket');
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return wss;
};

export const broadcastNewMember = (newMember) => {
  if (!wss) return;
  
  const message = JSON.stringify({
    type: 'NEW_MEMBER',
    data: newMember
  });
  
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(message);
    }
  });
  
  console.log('📢 Broadcasted new member to all clients');
};

export const broadcastDeletedMember = (memberId) => {
  if (!wss) return;
  
  const message = JSON.stringify({
    type: 'MEMBER_DELETED',
    data: { id: memberId }
  });
  
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
  
  console.log('📢 Broadcasted deleted member to all clients');
};