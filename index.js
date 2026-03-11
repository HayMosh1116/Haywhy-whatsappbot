const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');

async function startBot() {
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log('Baileys version', version, 'isLatest', isLatest);

  const { state, saveCreds } = await useMultiFileAuthState('auth');

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true
  });

  // credentials update handler (multi-file)
  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error && lastDisconnect.error.output &&
        lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut);
      console.log('connection closed due to', lastDisconnect.error, ', reconnecting', shouldReconnect);
      // reconnect if not logged out
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === 'open') {
      console.log('opened connection');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    console.log('got messages', messages);
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const sender = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

    // auto react to every incoming message with a laugh emoji
    await sock.sendMessage(sender, {
      react: { text: '😂', key: msg.key }
    });

    // if message came from a group, also pretend to be recording to prank participants
    if (sender && sender.endsWith('@g.us')) {
      try {
        await sock.sendPresenceUpdate('recording', sender);
      } catch (e) {
        console.error('failed to send group recording presence', e);
      }
    }

    // commands
    switch (text) {
      case 'ping':
        await sock.sendMessage(sender, { text: 'pong' });
        break;
      case '.record':
        await sock.sendPresenceUpdate('recording', sender);
        break;
      case '.typing':
        await sock.sendPresenceUpdate('composing', sender);
        break;
      case '.hello':
        await sock.sendMessage(sender, { text: "Hello 👋 I'm a prank bot" });
        break;
      default:
        break;
    }
  });

}

startBot();
