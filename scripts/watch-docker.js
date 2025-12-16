#!/usr/bin/env node

/**
 * Watch Docker and Database Schema
 * Automatically recreates Docker containers when schema files change
 * Usage: node scripts/watch-docker.js
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.dirname(__dirname);

// ============= Utilities =============

function isWindows() {
  return process.platform === 'win32';
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function log(message, level = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const icons = {
    info: 'ℹ️ ',
    success: '✅',
    warning: '⚠️ ',
    error: '❌',
    docker: '🐳',
    schema: '📋',
    watch: '👀',
  };
  console.log(`[${timestamp}] ${icons[level] || '•'} ${message}`);
}

function getFilesHash(filePaths) {
  try {
    let combinedContent = '';

    for (const filePath of filePaths) {
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          // Só tenta ler se for um arquivo, não um diretório
          combinedContent += fs.readFileSync(filePath, 'utf8');
        } else {
          log(`Ignorando ${filePath} - não é um arquivo`, 'warning');
        }
      } else {
        log(`Arquivo não encontrado: ${filePath}`, 'warning');
      }
    }

    return crypto.createHash('md5').update(combinedContent).digest('hex');
  } catch (error) {
    log(`Erro ao calcular hash: ${error.message}`, 'error');
    return null;
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

function isDockerComposeRunning() {
  try {
    execSync('docker-compose ps -q', {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: rootDir,
    });
    return true;
  } catch (e) {
    return false;
  }
}

// ============= Docker Operations =============

function startDocker() {
  try {
    log('Iniciando Docker Compose...', 'docker');
    execSync('docker-compose up -d', {
      cwd: rootDir,
      stdio: 'inherit',
    });
    log('Docker iniciado com sucesso', 'success');
    return true;
  } catch (error) {
    log(`Erro ao iniciar Docker: ${error.message}`, 'error');
    return false;
  }
}

function restartDocker() {
  try {
    log('Recriando containers Docker...', 'docker');
    execSync('docker-compose down -v', {
      cwd: rootDir,
      stdio: 'inherit',
    });

    log('Aguardando 2 segundos...', 'info');
    execSync(isWindows() ? 'timeout /t 2' : 'sleep 2', { stdio: 'pipe' });

    execSync('docker-compose up -d --build', {
      cwd: rootDir,
      stdio: 'inherit',
    });

    log('Docker recriado com sucesso', 'success');
    return true;
  } catch (error) {
    log(`Erro ao recriar Docker: ${error.message}`, 'error');
    return false;
  }
}

function getDockerStatus() {
  try {
    const output = execSync('docker-compose ps', {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return output;
  } catch (error) {
    return null;
  }
}

// ============= Schema Monitoring =============

function getSchemaFiles() {
  return [
    path.join(rootDir, 'apps/web/shared/schema.ts'),
    path.join(rootDir, 'apps/api/src/db/schema.ts'),
    path.join(rootDir, 'apps/web/server/db.ts'),
    path.join(rootDir, 'init.sql'),
  ].filter((f) => fs.existsSync(f));
}

function checkSchemaChanged(previousHash) {
  const schemaFiles = getSchemaFiles();
  const currentHash = getFilesHash(schemaFiles);

  if (!currentHash) {
    log('Não foi possível calcular hash do schema', 'warning');
    return false;
  }

  if (currentHash !== previousHash) {
    log('Mudanças detectadas no schema do banco', 'schema');
    return true;
  }

  return false;
}

// ============= File Watching =============

function watchSchemaFiles() {
  const schemaFiles = getSchemaFiles();
  const watchers = new Map();
  let debounceTimer = null;

  function handleChange() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      log('Detectada mudança no schema', 'watch');
      checkAndRestartDocker();
    }, 1000); // Aguarda 1 segundo para evitar múltiplas mudanças
  }

  schemaFiles.forEach((file) => {
    try {
      log(`Observando arquivo: ${path.relative(rootDir, file)}`, 'watch');
      const watcher = fs.watch(file, { persistent: true }, handleChange);
      watchers.set(file, watcher);
    } catch (error) {
      log(`Erro ao observar ${file}: ${error.message}`, 'warning');
    }
  });

  // Observar também o diretório de migrations
  const migrationsDir = path.join(rootDir, 'apps/api/src/db/migrations');
  if (fs.existsSync(migrationsDir)) {
    try {
      log(`Observando diretório de migrations: ${path.relative(rootDir, migrationsDir)}`, 'watch');
      const watcher = fs.watch(migrationsDir, { persistent: true, recursive: true }, handleChange);
      watchers.set(migrationsDir, watcher);
    } catch (error) {
      log(`Erro ao observar migrations: ${error.message}`, 'warning');
    }
  }

  return watchers;
}

// ============= Main Logic =============

function checkAndRestartDocker() {
  if (!isDockerRunning()) {
    log('Docker não está rodando', 'error');
    return;
  }

  if (restartDocker()) {
    log('Container recriado com sucesso', 'success');

    // Aguardar healthcheck do Postgres
    log('Aguardando Postgres ficar pronto...', 'info');
    execSync(isWindows() ? 'timeout /t 5' : 'sleep 5', { stdio: 'pipe' });

    log('Postgres está pronto', 'success');
  }
}

async function main() {
  log('======================================', 'info');
  log('Iniciador e Monitor de Docker', 'docker');
  log('======================================', 'info');

  // Verificar se Docker está instalado
  if (!isDockerRunning()) {
    log('Docker não está rodando. Por favor, inicie o Docker Desktop', 'error');
    process.exit(1);
  }

  log('Docker está rodando', 'success');

  // Iniciar Docker Compose se não estiver rodando
  if (!isDockerComposeRunning()) {
    log('Docker Compose não está ativo', 'warning');
    if (!startDocker()) {
      log('Falha ao iniciar Docker', 'error');
      process.exit(1);
    }
  } else {
    log('Docker Compose já está em execução', 'success');
  }

  // Mostrar status
  const status = getDockerStatus();
  if (status) {
    log('Status dos containers:', 'info');
    console.log(status);
  }

  // Começar a observar mudanças no schema
  log('Iniciando observação de mudanças...', 'watch');
  log('Pressione Ctrl+C para parar', 'info');

  const schemaFiles = getSchemaFiles();
  let currentHash = getFilesHash(schemaFiles);

  watchSchemaFiles();

  // Monitorar periodicamente (fallback)
  setInterval(() => {
    if (checkSchemaChanged(currentHash)) {
      currentHash = getFilesHash(schemaFiles);
      checkAndRestartDocker();
    }
  }, 5000);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('Monitor encerrado', 'warning');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Monitor encerrado', 'warning');
  process.exit(0);
});

// Run
main().catch((error) => {
  log(`Erro: ${error.message}`, 'error');
  process.exit(1);
});
