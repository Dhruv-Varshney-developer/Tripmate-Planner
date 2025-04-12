import {HandlerCallback } from '@elizaos/core';
import WebSocket from 'ws';

const WS_URL = 'ws://localhost:8765';
const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('Connected to TripMate WS server');
});

export function connectWebServer(callback: HandlerCallback) {
  
    ws.on('message', async (data) => {
      try {
        const parsed = JSON.parse(data.toString());
  
        if (!parsed.message || typeof parsed.message !== 'string') {
          console.warn('Invalid message received from TripMate:', data.toString());
          return;
        }

          await callback?.({ text: `${parsed.message}` });
      } catch (err) {
        console.error('Failed to handle message from TripMate:', err);
      }
    });
  }


ws.on('error', (err) => console.error('WS error:', err));
ws.on('close', () => console.log('WS connection closed'));

export async function sendToAgent2(message: string) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ message }));
    // console.log(`[Eliza → TripMate] ${message}`);
  } else {
    console.error('WebSocket is not open');
  }
}