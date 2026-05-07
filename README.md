# Salestroopz Desktop

**The Privacy-First, Autonomous SDR Agent**

Salestroopz Desktop is a world-class, autonomous Sales Development Representative (SDR) agent designed for power users who demand total control over their sales process. By operating **100% locally** on your machine, Salestroopz empowers you to research prospects, craft personalized outreach, and automate email sequences without your sensitive data ever touching a third-party server.

## Core Principles

- **Privacy-First:** Your data is 100% yours. No cloud processing, no data snooping, no exceptions.
- **Autonomous Intelligence:** From prospect research to automated follow-ups, Salestroopz streamlines the entire sales lifecycle.
- **Open-Source Freedom:** Built by developers, for developers. Extendable, transparent, and completely free to use.

---

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18+ recommended)
- [npm](https://www.npmjs.com/)

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone [your-repo-url]
   cd salestroopz
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run Locally:**
   ```bash
   npm run dev
   ```

### Building & Packaging

To generate a standalone executable for your environment:

1. **Build the frontend:**
   ```bash
   npm run build
   ```
2. **Package the agent:**
   ```bash
   npm run electron:build
   ```
The polished, production-ready executable will be available in the `release/` directory.

---

## Advanced Integrations

Salestroopz natively integrates with your favorite tools to maximize efficiency:

- **AI Providers:** Run LLMs via cloud (Gemini) or natively via local APIs (Ollama).
- **Email:** Full support for Gmail, Outlook, and custom SMTP configurations.
- **Calendar:** Seamless automated scheduling with Google or Outlook.
- **Prospecting:** Direct integration with LinkedIn for outreach and Apollo.io for enrichment.

---

## License

Salestroopz is released under the **MIT License**. You are free to use, modify, and distribute this software for any purpose, commercial or private. See the [LICENSE](LICENSE) file for more details.
