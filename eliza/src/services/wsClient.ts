// eliza-starter/src/services/wsClient.ts
import { AgentRuntime, HandlerCallback, IAgentRuntime, Memory, State } from '@elizaos/core';
import WebSocket from 'ws';
import { storeTripData } from '../storacha/tripStorage';

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
         // console.log(`[TripMate → Eliza] ${parsed.message}`);
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
    console.log(`[Eliza → TripMate] ${message}`);
  } else {
    console.error('WebSocket is not open');
  }
}

/*  Improve: Split Responsibilities: Storage vs Sending */
// runtime.registerAction({
    //   name: 'planTrip',
    //   description: 'Forward user message to TripMate Agent for travel planning.',
    //   similes: ['plan', 'book', 'search travel', 'find', 'get', 'trip'],
    //   validate: async (_, message) => {
    //     const msg = message.content.text.toLowerCase();
    //     return msg.includes("plan") || msg.includes("trip") || msg.includes("book");
    //   },
    //   handler: async (_, message, state, options, callback) => {
    //     const msg=message.content.text
    //     sendToAgent2(msg);
    //     // callback?.({ text: "Planning....sit back and relax" });
    //     connectWebServer(callback)
    //     console.log("sending via another action");
    //   },
    //   examples: [
    //     [{ user: "{{user1}}", content: { text: "Plan my trip from Goa to Delhi on 14 May" } },
    //      { user: "{{agent}}", content: { text: "Query sent to TripMate. Awaiting response..." } }],
    //   ],
    // });