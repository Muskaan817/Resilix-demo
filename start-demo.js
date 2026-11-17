/**
 * Cross-platform runner to start both Backend and Frontend concurrently in one terminal
 */

const { spawn } = require('child_process');
const path = require('path');

const rootDir = __dirname;
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

console.log('========================================================');
console.log('🚀 Starting Resilix Demo (Backend + Frontend)...');
console.log('   Backend:  http://localhost:5001');
console.log('   Frontend: http://localhost:3000');
console.log('========================================================\n');

function runProcess(name, cmd, args, cwd, color) {
  const proc = spawn(cmd, args, {
    cwd,
    shell: true,
    stdio: ['inherit', 'pipe', 'pipe'],
    env: { ...process.env, FORCE_COLOR: 'true' },
  });

  proc.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(Boolean);
    lines.forEach((line) => console.log(`${color}[${name}]\x1b[0m ${line}`));
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().split('\n').filter(Boolean);
    lines.forEach((line) => console.error(`${color}[${name}]\x1b[0m \x1b[31m${line}\x1b[0m`));
  });

  proc.on('close', (code) => {
    console.log(`${color}[${name}]\x1b[0m exited with code ${code}`);
  });

  return proc;
}

const backendProc = runProcess('Backend', 'npm', ['start'], backendDir, '\x1b[36m');
const frontendProc = runProcess('Frontend', 'npm', ['run', 'dev'], frontendDir, '\x1b[35m');

function cleanup() {
  console.log('\nStopping servers...');
  backendProc.kill();
  frontendProc.kill();
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
