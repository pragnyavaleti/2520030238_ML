const { spawn } = require('child_process');
const path = require('path');

const pyScript = path.join(__dirname, 'train_models.py');
console.log('Spawning Python to run:', pyScript);

const child = spawn('python', [pyScript], {
  cwd: __dirname,
  stdio: 'inherit'
});

child.on('exit', (code) => {
  console.log(`Python process finished with exit code: ${code}`);
  process.exit(code || 0);
});

child.on('error', (err) => {
  console.error('Failed to start python process:', err);
  process.exit(1);
});
