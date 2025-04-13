# Eliza - TripMate Planner Agent

Eliza is a witty and sarcastic AI-powered travel planning assistant that helps users plan their perfect vacation while maintaining a humorous tone. This agent is part of the larger TripMate ecosystem and integrates with Storacha for decentralized storage.

## Prerequisites

- Node.js version 22 or higher
- pnpm package manager
- Git
- Telegram account (for bot creation)
- OpenRouter API key
- Storacha account and w3cli tools

## Installation Steps

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd eliza
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Set Up Storacha Integration**

   a. Install w3cli tool:

   ```bash
   npm install -g @web3-storage/w3cli
   ```

   b. Generate a DID (Decentralized Identifier):

   ```bash
   w3 key create
   ```

   Save both the private key (starts with Mg...) and public key (starts with did:key:)

   c. Create a Space:

   ```bash
   w3 space create [YOUR_SPACE_NAME]
   ```

   Save the space DID for later use

   d. Create Delegation:

   ```bash
   w3 delegation create -c space/blob/add -c space/index/add -c filecoin/offer -c upload/add <YOUR_AGENT_DID> --base64
   ```

   Save the delegation output for environment variables.

   Refer [Storacha docs](https://docs.storacha.network/ai/quickstart/) to learn more!

4. **Set Up Telegram Bot**

   - Go to [@BotFather](https://t.me/botfather) on Telegram.
   - Create a new bot using the `/newbot` command
   - Save the bot token provided by BotFather

5. **Configure Environment Variables**

   Create a `.env` file in the project root:

   ```bash
   cp .env.example .env
   ```

   Add the following variables to your `.env` file:

   ```
   # Required API Keys
   OPENROUTER_API_KEY="your-openrouter-api-key"
   TELEGRAM_BOT_TOKEN="your-telegram-bot-token"

   # Storacha Configuration
   STORACHA__AGENT_PRIVATE_KEY="your-private-key-from-w3-key-create"
   STORACHA__AGENT_DELEGATION="your-delegation-from-w3-delegation-create"

   # WebSocket Configuration (choose one)
   WS_URL="wss://tripmate-finder-production.up.railway.app/"
   # or for local development after setting up [Tripmate-Finder](https://github.com/Dhruv-Varshney-developer/Tripmate-Finder):
   # WS_URL="ws://localhost:8765"



   # Optional Database Configuration
   # POSTGRES_URL="your-postgres-url"  # If using PostgreSQL
   # SQLITE_FILE="custom/path/to/db.sqlite"  # If using custom SQLite path
   ```

6. **Start the Agent**

   ```bash
   pnpm start
   ```

   For custom character configuration:

   ```bash
   pnpm start --characters="path/to/your/character.json"
   ```

## Integration with TripMate Ecosystem

This agent is part of the TripMate ecosystem and works in conjunction with:

- [TripMate-Finder](https://github.com/Dhruv-Varshney-developer/Tripmate-Finder) - Provides real-time travel data
- [TripMate-Share](https://github.com/Dhruv-Varshney-developer/Tripmate-Share) - Handles sharing travel information

To run ELIZA with a local TripMate-Finder instance, clone and set up the TripMate-Finder repository first, then set WS_URL to your local WebSocket URL

The WebSocket connection to TripMate-Finder is then automatically established using the WS_URL environment variable.
