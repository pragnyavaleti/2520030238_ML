const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Python FastAPI ML Service on port 8000...');

const child = spawn('python', ['-m', 'uvicorn', 'app:app', '--host', '127.0.0.1', '--port', '8000'], {
  cwd: __dirname,
  stdio: 'inherit'
});

child.on('exit', (code) => {
  console.log(`FastAPI process exited with code ${code}`);
});

child.on('error', (err) => {
  console.error('Failed to spawn FastAPI service:', err);
});
