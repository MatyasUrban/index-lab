import { exec } from 'child_process';
import util from 'util';
const execAsync = util.promisify(exec);

export default async function globalSetup() {
  console.log('Composing Docker containers...');
  await execAsync('docker compose down -v', { cwd: process.cwd() });
  await execAsync('docker compose up -d', { cwd: process.cwd() });
  await execAsync('npx wait-on http://localhost:3000', { cwd: process.cwd() });
  console.log('✅  Docker containers are up.');
}
