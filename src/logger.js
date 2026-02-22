// Simple logger for the app
export function log(message, ...args) {
  const timestamp = new Date().toISOString();
  const fullMessage = `[${timestamp}] ${message}`;
  console.log(fullMessage, ...args);
  try {
    const fs = window.require ? window.require('fs') : null;
    if (fs) {
      fs.appendFile('app.log', `${fullMessage} ${args.join(' ')}\n`, () => {});
    }
  } catch (e) {
    // Ignore file write errors in browser
  }
}
