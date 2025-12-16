#!/usr/bin/env node

/**
 * Schema Watcher
 *
 * This script watches for changes in database schema files and automatically
 * recreates Docker containers when changes are detected.
 *
 * Usage: node scripts/watch-schema.js
 * Or in package.json: "watch:schema": "node scripts/watch-schema.js"
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const SCHEMA_FILES = [
  'apps/web/shared/schema.ts',
  'apps/api/src/db/schema.ts',
  'init.sql',
  'docker-compose.yml',
];

const WATCH_INTERVAL = 2000; // Check every 2 seconds
const HASH_FILE = path.join(rootDir, '.schema-watch-hash');

let lastHash = null;
let isProcessing = false;

function isWindows() {
  return process.platform === 'win32';
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getFilesHash() {
  try {
    let combinedContent = '';

    for (const file of SCHEMA_FILES) {
      const filePath = path.join(rootDir, file);
      if (fs.existsSync(filePath)) {
        combinedContent += fs.readFileSync(filePath, 'utf8');
      }
    }

    return crypto.createHash('md5').update(combinedContent).digest('hex');
  } catch (error) {
    console.error('❌ Error calculating hash:', error.message);
    return null;
  }
}

function loadPreviousHash() {
  try {
    if (fs.existsSync(HASH_FILE)) {
      return fs.readFileSync(HASH_FILE, 'utf8').trim();
    }
  } catch (error) {
    console.warn('⚠️  Warning: Could not read previous hash');
  }
  return null;
}

function savePreviousHash(hash) {
  try {
    fs.writeFileSync(HASH_FILE, hash);
  } catch (error) {
    console.error('❌ Error saving hash:', error.message);
  }
}

function recreateContainers() {
  console.log('\n🔔 Database schema changes detected!');
  console.log('🔨 Recreating Docker containers...\n');

  try {
    execSync('docker-compose down -v', { stdio: 'inherit' });
    execSync('docker-compose up -d --build', { stdio: 'inherit' });
    console.log('\n✨ Containers recreated successfully!');
  } catch (error) {
    console.error('\n❌ Error recreating containers:', error.message);
  }
}

function initializeWatcher() {
  console.log('👀 Watching for database schema changes...');
  console.log(`📁 Monitoring files:`);
  SCHEMA_FILES.forEach((file) => {
    const filePath = path.join(rootDir, file);
    const exists = fs.existsSync(filePath) ? '✅' : '⚠️ ';
    console.log(`   ${exists} ${file}`);
  });
  console.log(`\n⏱️  Check interval: ${WATCH_INTERVAL}ms`);
  console.log('📌 Press Ctrl+C to stop watching\n');
}

async function watch() {
  initializeWatcher();

  // Load initial hash
  lastHash = loadPreviousHash();
  const currentHash = getFilesHash();

  if (lastHash && currentHash) {
    savePreviousHash(currentHash);
    lastHash = currentHash;
  }

  while (true) {
    await sleep(WATCH_INTERVAL);

    if (isProcessing) continue;

    try {
      const currentHash = getFilesHash();

      if (!currentHash) {
        console.warn('⚠️  Warning: Could not calculate schema hash');
        continue;
      }

      if (lastHash && currentHash !== lastHash) {
        isProcessing = true;
        recreateContainers();
        savePreviousHash(currentHash);
        lastHash = currentHash;
        isProcessing = false;
      } else if (!lastHash) {
        lastHash = currentHash;
        savePreviousHash(currentHash);
      }
    } catch (error) {
      console.error('❌ Error in watch loop:', error.message);
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopped watching for changes');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Stopped watching for changes');
  process.exit(0);
});

watch().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
