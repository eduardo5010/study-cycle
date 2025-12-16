#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '../..');

function isWindows() {
  return process.platform === 'win32';
}

function sleep(ms) {
  if (isWindows()) {
    try {
      // Use PowerShell Start-Sleep for more reliable Windows sleep
      execSync(`powershell -Command "Start-Sleep -Milliseconds ${ms}"`, { stdio: 'pipe' });
    } catch (e) {
      // If PowerShell fails, fallback to timeout command
      try {
        execSync(`timeout /t ${Math.ceil(ms / 1000)} >nul`, { stdio: 'pipe' });
      } catch (timeoutError) {
        // timeout command returns non-zero exit code when interrupted, ignore it
      }
    }
  } else {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

function getFilesHash(filePaths) {
  try {
    let combinedContent = '';

    for (const filePath of filePaths) {
      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
          combinedContent += fs.readFileSync(filePath, 'utf8');
        }
      }
    }

    return crypto.createHash('md5').update(combinedContent).digest('hex');
  } catch (error) {
    console.error('Error calculating hash:', error.message);
    return null;
  }
}

function checkSchemaChanged() {
  try {
    const hashFile = path.join(rootDir, '.database-hash');

    // Files to monitor for changes
    const schemaFiles = [
      path.join(rootDir, 'apps/web/shared/schema.ts'),
      path.join(rootDir, 'apps/api/src/db/schema.ts'),
      path.join(rootDir, 'init.sql'),
    ];

    const currentHash = getFilesHash(schemaFiles.filter((f) => fs.existsSync(f)));

    if (!currentHash) {
      console.warn('⚠️  Warning: Could not calculate schema hash');
      return false;
    }

    let prevHash = '';
    if (fs.existsSync(hashFile)) {
      prevHash = fs.readFileSync(hashFile, 'utf8').trim();
    }

    if (currentHash !== prevHash) {
      fs.writeFileSync(hashFile, currentHash);
      console.log('🔄 Schema changed, recreating containers...');
      return true;
    } else {
      console.log('✅ Schema unchanged');
      return false;
    }
  } catch (error) {
    console.error('Error checking schema:', error);
    return false;
  }
}

function isDockerRunning() {
  try {
    execSync('docker info', { stdio: 'pipe' });
    return true;
  } catch (e) {
    return false;
  }
}

function getDockerContainerStatus() {
  try {
    const output = execSync('docker-compose ps -a --format json', {
      encoding: 'utf8',
      stdio: 'pipe',
    });

    if (!output.trim()) {
      return { exists: false };
    }

    const containers = JSON.parse(output);
    const postgresContainer = containers.find((c) => c.Service === 'postgres');

    return {
      exists: !!postgresContainer,
      running: postgresContainer?.State === 'running',
    };
  } catch (e) {
    return { exists: false, running: false };
  }
}

function startDockerNormal() {
  console.log('🚀 Starting Docker containers...');
  execSync('docker-compose up -d', { stdio: 'inherit' });
  waitForPostgres();
}

function recreateDocker() {
  console.log('🔨 Recreating Docker containers...');
  try {
    execSync('docker-compose down -v', { stdio: 'inherit' });
  } catch (e) {
    console.warn('⚠️  Warning: Could not cleanly stop containers');
  }
  execSync('docker-compose up -d --build', { stdio: 'inherit' });
  waitForPostgres();
}

function waitForPostgres() {
  console.log('⏳ Waiting for PostgreSQL to be ready...');
  let attempts = 0;
  const maxAttempts = 30; // 30 seconds max (reduced since containers should be running)

  while (attempts < maxAttempts) {
    try {
      execSync('docker-compose exec -T postgres pg_isready -U studycycle -d studycycle', {
        stdio: 'pipe',
        shell: isWindows() ? 'cmd.exe' : '/bin/bash',
      });
      console.log('✨ PostgreSQL is ready!');
      return;
    } catch (e) {
      attempts++;
      console.log(`⏳ PostgreSQL starting... (${attempts}/${maxAttempts})`);
      sleep(1000);
    }
  }

  console.log('⚠️  PostgreSQL check timed out, but containers may still be starting...');
  // Don't throw error, just warn - containers might still be working
}

async function main() {
  try {
    if (!isDockerRunning()) {
      console.error('❌ Docker is not running. Please start Docker and try again.');
      process.exit(1);
    }

    const status = getDockerContainerStatus();

    // If containers don't exist, always create them
    if (!status.exists) {
      console.log('📦 No containers found, creating...');
      startDockerNormal();
      return;
    }

    // If schema changed, recreate containers
    if (checkSchemaChanged()) {
      recreateDocker();
    } else if (status.running) {
      console.log('✅ Docker containers already running');
    } else {
      console.log('🔄 Containers exist but not running, starting...');
      startDockerNormal();
    }
  } catch (error) {
    console.error('❌ Error managing Docker:', error.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
