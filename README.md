# WhatsApp Bot

This is a simple WhatsApp bot built using [Baileys](https://github.com/WhiskeySockets/Baileys) (a WhatsApp Web API library).

## Setup

1. **Install Node.js & npm** (v16+ recommended). If you don't have npm, install from https://nodejs.org/.  
2. Open a terminal and navigate to this directory:
   ```bash
   cd /Users/dev_haywhy/whatsapp-bot/whatsappbot
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the bot:
   ```bash
   npm start
   ```

   The bot will print a QR code in the terminal. Scan it with WhatsApp to authenticate.

## Bot behavior

- Auto-reacts to every incoming message with a 😂 emoji.
- When messages arrive in a **group**, the bot also sends a fake “recording” presence update to prank members.
- Built-in commands:
  - `ping` → replies `pong`
  - `.record` → sends a “recording” presence update
  - `.typing` → sends a “composing” presence update
  - `.hello` → replies with a prank greeting

## Notes
- Authentication state is stored in the `auth/` directory using multi-file auth.
- On disconnects (except logout), the bot will attempt to reconnect.

Feel free to extend the message handler with your own commands or logic!
