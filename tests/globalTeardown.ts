import util from 'util';
import { exec } from 'child_process';
const execAsync = util.promisify(exec);

export default async function globalTeardown() {
  console.log('Tearing down Docker containers...');
  await execAsync('docker compose down -v', { cwd: process.cwd() });
  console.log('✅  Docker containers are down.');
}

