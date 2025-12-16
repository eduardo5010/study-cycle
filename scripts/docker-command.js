#!/usr/bin/env node

/**
 * Quick Docker Commands Helper
 * Provides easy access to common Docker operations
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.dirname(__dirname);

const commands = {
  status: () => {
    console.log('📊 Status dos containers:\n');
    execSync('docker-compose ps', { cwd: rootDir, stdio: 'inherit' });
  },

  logs: () => {
    console.log('📋 Logs do Postgres:\n');
    execSync('docker-compose logs -f postgres', { cwd: rootDir, stdio: 'inherit' });
  },

  'logs-pgadmin': () => {
    console.log('📋 Logs do PgAdmin:\n');
    execSync('docker-compose logs -f pgadmin', { cwd: rootDir, stdio: 'inherit' });
  },

  shell: () => {
    console.log('🐚 Abrindo shell no Postgres...\n');
    execSync('docker-compose exec postgres bash', { cwd: rootDir, stdio: 'inherit' });
  },

  psql: () => {
    console.log('🗄️  Conectando ao banco de dados...\n');
    execSync('docker-compose exec postgres psql -U studycycle -d studycycle', {
      cwd: rootDir,
      stdio: 'inherit',
    });
  },

  reset: () => {
    console.log('🔄 Resetando banco de dados...\n');
    execSync('docker-compose down -v && docker-compose up -d', { cwd: rootDir, stdio: 'inherit' });
    console.log('✅ Banco resetado com sucesso\n');
  },

  clean: () => {
    console.log('🧹 Limpando volumes e containers...\n');
    execSync('docker-compose down -v', { cwd: rootDir, stdio: 'inherit' });
    console.log('✅ Limpeza concluída\n');
  },

  help: () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║          Docker Quick Commands Helper                 ║
╚════════════════════════════════════════════════════════╝

Uso: npm run docker:command <command>

Comandos disponíveis:

  status      Mostrar status dos containers
  logs        Ver logs do Postgres
  logs-pgadmin Ver logs do PgAdmin
  shell       Abrir shell no container Postgres
  psql        Conectar ao banco de dados interativamente
  reset       Resetar banco de dados (remove dados)
  clean       Parar e remover todos os containers
  help        Mostrar esta mensagem

Exemplos:

  npm run docker:command status
  npm run docker:command logs
  npm run docker:command shell
  npm run docker:command reset
    `);
  },
};

const command = process.argv[2] || 'help';

if (commands[command]) {
  try {
    commands[command]();
  } catch (error) {
    console.error(`❌ Erro ao executar comando: ${error.message}`);
    process.exit(1);
  }
} else {
  console.error(`❌ Comando desconhecido: "${command}"`);
  console.log('\nComandos disponíveis:');
  Object.keys(commands).forEach((cmd) => {
    console.log(`  - ${cmd}`);
  });
  process.exit(1);
}
