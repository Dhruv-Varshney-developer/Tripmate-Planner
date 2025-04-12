# TripMate

TripMate is a sassy AI-powered travel assistant with attitude. It helps you find flights, hotels, trains, and attractions while keeping the tone light and humorous.
Tripmate is a multi-agentic travel planning system powered by Storacha.

## Agents

- **[TripMate Planner](eliza/README.md)** -This agent handles core user interaction logic using ElizaOS and stores user data in Storacha.

- **[Tripmate-Share](https://github.com/Dhruv-Varshney-developer/Tripmate-Share)** – An AI agent that shares travel information with family and friends.

- **[Tripmate-Finder](https://github.com/Dhruv-Varshney-developer/Tripmate-Finder)** – This agent searches for real-time travel data using Gemini and the SERP API.

## How It Works

- **Tripmate-Planner**:  
  Operates as a Telegram bot to interact with users. It processes trip planning requests via ElizaOS and stores finalized trip details in Storacha.

- **Tripmate-Finder**:  
  Connects with the Planner Agent via API, fetching the latest travel-related data to enrich the planning experience.

- **Tripmate-Share**:  
  Currently in development. It will view final trip details from Storacha and display them in a shareable format. Friends and family can interact with this agent to ask questions, view plans, and leave comments or suggestions. All feedback will be stored back in Storacha and subsequently retrieved by the Planner Agent, creating a seamless collaborative loop.

For more details about each agent and their configurations, please refer to the respective README files in their repositories or follow the links above.

**🚧 Development Note**
This project was initially started by importing code from the lit-storacha demo repository, as we intended to build on top of the existing setup.

As development progressed, we realized the need to customize the Storacha integration to fit our specific use case — a trip planning agent.

While we referenced the original repository during the early stages, the current Storacha integration is entirely custom-written and independent of the lit-storacha demo. Storacha remains one of our supporters, and we appreciate their support for this project.
