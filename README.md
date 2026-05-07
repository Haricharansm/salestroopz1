# AI SDR

What is Salestroopz? Salestroopz Desktop is an autonomous Sales Development Representative (SDR) agent that runs 100% locally on your machine. It uses a local LLM via Ollama to research prospects, craft personalised outreach campaigns, and send emails — all without your data ever touching a third-party server. Key principles:

## Installation and Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- [npm](https://www.npmjs.com/) 

### Setup

1. **Clone the repository.**
2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running Locally

To run the application in development mode:

```bash
npm run dev
```

### Building and Packaging

To package the application for your operating system:

1. **Build the frontend:**
   ```bash
   npm run build
   ```
2. **Build and package the Electron app:**
   ```bash
   npm run electron:build
   ```

The packaged executable will be available in the `release/` directory.

## Configuration

The application stores settings locally in an SQLite database (`app.db`).
When running the app, navigate to the **Settings** page to connect your accounts:

- **AI Provider:** Choose between Gemini (Cloud) or a local OpenSource model (via Ollama or similar local API).
- **Email Integration:** Configure your Gmail/Outlook/SMTP credentials.
- **Calendar Integration:** Connect your Google or Outlook calendar for automated scheduling.

## Features

- **Campaign Analytics:** Visual dashboards for engagement and intent tracking.
- **Autonomous Sequencing Engine:** Automatically handles email follow-ups based on predefined cadences.
- **Secure Local Storage:** Data is stored locally on your machine for enhanced privacy.
