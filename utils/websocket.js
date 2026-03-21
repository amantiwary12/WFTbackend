// import { WebSocketServer } from 'ws';

// let wss;

// export const createWebSocketServer = (server) => {
//   wss = new WebSocketServer({ server });
  
//   wss.on('connection', (ws) => {
//     console.log('✅ New client connected to WebSocket');
    
//     ws.on('close', () => {
//       console.log('❌ Client disconnected from WebSocket');
//     });
    
//     ws.on('error', (error) => {
//       console.error('WebSocket error:', error);
//     });
//   });

//   return wss;
// };

// export const broadcastNewMember = (newMember) => {
//   if (!wss) return;
  
//   const message = JSON.stringify({
//     type: 'NEW_MEMBER',
//     data: newMember
//   });
  
//   wss.clients.forEach((client) => {
//     if (client.readyState === 1) { // 1 = OPEN
//       client.send(message);
//     }
//   });
  
//   console.log('📢 Broadcasted new member to all clients');
// };

// export const broadcastDeletedMember = (memberId) => {
//   if (!wss) return;
  
//   const message = JSON.stringify({
//     type: 'MEMBER_DELETED',
//     data: { id: memberId }
//   });
  
//   wss.clients.forEach((client) => {
//     if (client.readyState === 1) {
//       client.send(message);
//     }
//   });
  
//   console.log('📢 Broadcasted deleted member to all clients');
// };





// websocket.js
import { WebSocketServer } from 'ws';
import { URL } from 'url';

let wss;

export const createWebSocketServer = (server) => {
  wss = new WebSocketServer({ 
    server,
    path: '/ws' // ✅ Add specific WebSocket path
  });
  
  wss.on('connection', (ws, req) => {
    try {
      // ✅ Extract wedding code from query parameters
      const url = new URL(req.url, `http://${req.headers.host}`);
      const weddingCode = url.searchParams.get('weddingCode');
      
      // Store wedding code with WebSocket connection
      ws.weddingCode = weddingCode;
      
      console.log(`✅ New client connected to WebSocket for wedding: ${weddingCode || 'No wedding code'}`);
      
      ws.on('close', () => {
        console.log(`❌ Client disconnected from WebSocket for wedding: ${ws.weddingCode || 'No wedding code'}`);
      });
      
      ws.on('error', (error) => {
        console.error(`WebSocket error for wedding ${ws.weddingCode}:`, error);
      });

    } catch (error) {
      console.error('Error handling WebSocket connection:', error);
      ws.close(); // Close connection if there's an error
    }
  });

  return wss;
};

export const broadcastNewMember = (newMember) => {
  if (!wss) return;
  
  const message = JSON.stringify({
    type: 'NEW_MEMBER',
    data: newMember,
    weddingCode: newMember.weddingCode // ✅ Include wedding code in message
  });
  
  let sentCount = 0;
  
  wss.clients.forEach((client) => {
    // ✅ Only send to clients in the same wedding
    if (client.readyState === 1 && client.weddingCode === newMember.weddingCode) {
      client.send(message);
      sentCount++;
    }
  });
  
  console.log(`📢 Broadcasted new member to ${sentCount} clients in wedding: ${newMember.weddingCode}`);
};

export const broadcastDeletedMember = (memberId, weddingCode) => {
  if (!wss) return;
  
  const message = JSON.stringify({
    type: 'MEMBER_DELETED',
    data: { id: memberId },
    weddingCode: weddingCode // ✅ Include wedding code
  });
  
  let sentCount = 0;
  
  wss.clients.forEach((client) => {
    // ✅ Only send to clients in the same wedding
    if (client.readyState === 1 && client.weddingCode === weddingCode) {
      client.send(message);
      sentCount++;
    }
  });
  
  console.log(`📢 Broadcasted deleted member to ${sentCount} clients in wedding: ${weddingCode}`);
};

// ✅ New function to get connected clients count per wedding
export const getConnectedClientsCount = (weddingCode) => {
  if (!wss) return 0;
  
  let count = 0;
  wss.clients.forEach((client) => {
    if (client.readyState === 1 && client.weddingCode === weddingCode) {
      count++;
    }
  });
  
  return count;
};