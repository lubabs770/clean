#!/usr/bin/env node

const readline = require('readline');
const path = require('path');
const { spawn } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the music directory path (default: ../music): ', (musicDir) => {
  const defaultDir = path.join(__dirname, '..', 'music');
  const finalDir = musicDir.trim() || defaultDir;

  console.log(`Using music directory: ${finalDir}`);

  // Spawn the server in background
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

  rl.close();
});