import { DirectClient } from "@elizaos/client-direct";
import {
  AgentRuntime,
  elizaLogger,
  settings,
  stringToUuid,
  type Character,
} from "@elizaos/core";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
import fs from "fs";
import net from "net";
import path from "path";
import { fileURLToPath } from "url";
import { initializeDbCache } from "./cache/index.ts";
import { character } from "./character.ts";
import { initializeClients } from "./clients/index.ts";
import {
  getTokenForProvider,
  loadCharacters,
  parseArguments,
} from "./config/index.ts";
import { initializeDatabase} from "./database/index.ts";
import { getStorageClient } from "@storacha/elizaos-plugin";
import { retrieveTripData, storeTripData } from "./storacha/tripStorage.ts";
import { connectWebServer, sendToAgent2 } from "./services/wsClient.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

declare module "@elizaos/core" {
  export enum ServiceType {
    STORACHA = "storacha",
  }
}

// Extend the ServiceType enum
declare module "@elizaos/core" {
  interface Service {
    tripRouter?: (data: any) => Promise<string>;
    retrieveTripData?: (cid: string) => Promise<any>;
  }
}


export const wait = (minTime: number = 1000, maxTime: number = 3000) => {
  const waitTime =
    Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  return new Promise((resolve) => setTimeout(resolve, waitTime));
};

export function createAgent(
  character: Character,
  db: any,
  cache: any,
  token: string
) {
  elizaLogger.success(
    elizaLogger.successesTitle,
    "Creating runtime for character",
    character.name
  );

  return new AgentRuntime({
    databaseAdapter: db,
    token,
    modelProvider: character.modelProvider,
    evaluators: [],
    character,
    plugins: [bootstrapPlugin].filter(Boolean),
    providers: [],
    actions: [],
    services: [],
    managers: [],
    cacheManager: cache,
  });
}

async function startAgent(character: Character, directClient: DirectClient) {
  try {
    character.id ??= stringToUuid(character.name);
    character.username ??= character.name;

    const token = getTokenForProvider(character.modelProvider, character);
    const dataDir = path.join(__dirname, "../data");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const db = initializeDatabase(dataDir);
    await db.init();
    const cache = initializeDbCache(character, db);
    const runtime = createAgent(character, db, cache, token);
    const storageClient = await getStorageClient(runtime as any);

    await runtime.initialize();

    runtime.registerAction({
      name: 'tripRouter',
      description: 'Plan by routing trip data to Agent2 and Store summarized trip data as an attachment in decentralized storage.',
      similes: ['plan', 'trip', 'book', 'flight', 'save', 'upload'],
      validate: async () => true,
      handler: async (_, message, state, options, callback) => {
        const msg=message.content.text.toLocaleLowerCase()
        if(msg.includes("save") || msg.includes("upload") || msg.includes("store")){
          await storeTripData(state, callback, storageClient)
        }

        if (msg.includes('plan') || msg.includes('trip') || msg.includes('book')) {
          await sendToAgent2(msg);
          connectWebServer(callback)
        }
      },
      examples: [
        [{ user: "{{user1}}", content: { text: "Save my trip details." } },
         { user: "{{agent}}", content: { text: "Trip data saved! Here is the link : https://{{CID}}.ipfs.w3s.link/" } }],
      ],
    });

    runtime.registerAction({
      name: 'retrieveTripData',
      description: 'Retrieve trip data from decentralized storage using CID.',
      similes: ['RETRIEVE', 'FETCH', 'LOAD', 'SEND'],
      validate: async () => true,
      handler: async (_, message, state, options, callback) => {
        const msg=message.content.text
        if(msg.includes("send") || msg.includes("retrieve") || msg.includes("fetch")){
          await retrieveTripData(message, state, callback, storageClient)
        }
      },
      examples: [
        [{ user: "{{user1}}", content: { text: "Retrieve my trip data..." } },
         { user: "{{agent}}", content: { text: "Here’s your trip data: { Budget... }" } }],
      ],
    });

    runtime.clients = await initializeClients(character, runtime);

    directClient.registerAgent(runtime);

    // report to console
    elizaLogger.debug(`Started ${character.name} as ${runtime.agentId}`);

    return runtime;
  } catch (error) {
    elizaLogger.error(
      `Error starting agent for character ${character.name}:`,
      error
    );
    console.error(error);
    throw error;
  }
}

const checkPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        resolve(false);
      }
    });

    server.once("listening", () => {
      server.close();
      resolve(true);
    });

    server.listen(port);
  });
};

const startAgents = async () => {
  const directClient = new DirectClient();
  let serverPort = parseInt(settings.SERVER_PORT || "3000");
  const args = parseArguments();

  let charactersArg = args.characters || args.character;
  let characters = [character];

  console.log("charactersArg", charactersArg);
  if (charactersArg) {
    characters = await loadCharacters(charactersArg);
  }
  console.log("characters", characters);
  try {
    for (const character of characters) {
      await startAgent(character, directClient as DirectClient);
    }
  } catch (error) {
    elizaLogger.error("Error starting agents:", error);
  }

  while (!(await checkPortAvailable(serverPort))) {
    elizaLogger.warn(`Port ${serverPort} is in use, trying ${serverPort + 1}`);
    serverPort++;
  }

  // upload some agent functionality into directClient
  directClient.startAgent = async (character: Character) => {
    // wrap it so we don't have to inject directClient later
    return startAgent(character, directClient);
  };

  directClient.start(serverPort);

  if (serverPort !== parseInt(settings.SERVER_PORT || "3000")) {
    elizaLogger.log(`Server started on alternate port ${serverPort}`);
  }

  const isDaemonProcess = process.env.DAEMON_PROCESS === "true";
};

startAgents().catch((error) => {
  elizaLogger.error("Unhandled error in startAgents:", error);
  process.exit(1);
});
