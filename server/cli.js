#!/usr/bin/env node

// Helper script to start the music server with a specified directory.
// Supports an interactive prompt *and* command-line arguments so the
// application can run against any folder without editing code.
//
// Usage examples:
//   ./cli.js                 # ask the user (default: ../music)
//   ./cli.js /path/to/data   # use this path directly
//   ./cli.js --dir /path      # same thing
//   ./cli.js -d /path         # shorthand

const readline = require('readline');
const path = require('path');
const { spawn } = require('child_process');

const defaultDir = path.join(__dirname, '..', 'music');

// tiny, dependency‑free arg parser
const args = process.argv.slice(2);
let musicDirArg;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--dir' || args[i] === '-d') {
    musicDirArg = args[i + 1];
    i++;
  } else if (!musicDirArg && !args[i].startsWith('-')) {
    musicDirArg = args[i];
  }
}

function startServer(finalDir) {
  console.log(`Using music directory: ${finalDir}`);

  const server = spawn('node', ['server.js'], {
    cwd: __dirname,
    env: { ...process.env, MUSIC_DIR: finalDir },
    detached: true,
    stdio: 'ignore'
  });

  server.unref();

  console.log(`Server started in background with PID: ${server.pid}`);
  console.log(`To kill the server, run: kill ${server.pid}`);
  console.log('Server is running on http://localhost:3001');
}

if (musicDirArg) {
  const finalDir = path.resolve(musicDirArg);
  startServer(finalDir);
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter the music directory path (default: ../music): ', (musicDir) => {
    const finalDir = musicDir.trim() || defaultDir;
    startServer(finalDir);
    rl.close();
  });
}
