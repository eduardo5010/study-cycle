#!/usr/bin/env node

/**
 * Verificador de Configuração Docker
 * Valida se tudo está pronto para rodar
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.dirname(__dirname);

const checks = [];

function check(name, fn) {
  try {
    const result = fn();
    checks.push({
      name,
      passed: result.passed,
      message: result.message,
    });
  } catch (error) {
    checks.push({
      name,
      passed: false,
      message: error.message,
    });
  }
}

// Verificações
check('Docker instalado', () => {
  try {
    execSync('docker --version', { stdio: 'pipe' });
    return { passed: true, message: 'Docker encontrado' };
  } catch (e) {
    return { passed: false, message: 'Docker não encontrado. Instale Docker Desktop.' };
  }
});

check('Docker Desktop rodando', () => {
  try {
    execSync('docker info', { stdio: 'pipe' });
    return { passed: true, message: 'Docker está rodando' };
  } catch (e) {
    return { passed: false, message: 'Docker não está em execução. Inicie Docker Desktop.' };
  }
});

check('Docker Compose', () => {
  try {
    execSync('docker-compose --version', { stdio: 'pipe' });
    return { passed: true, message: 'Docker Compose encontrado' };
  } catch (e) {
    return { passed: false, message: 'Docker Compose não encontrado' };
  }
});

check('Node.js', () => {
  try {
    const version = execSync('node --version', { encoding: 'utf8' }).trim();
    return { passed: true, message: `Node.js ${version} encontrado` };
  } catch (e) {
    return { passed: false, message: 'Node.js não encontrado' };
  }
});

check('npm', () => {
  try {
    const version = execSync('npm --version', { encoding: 'utf8' }).trim();
    return { passed: true, message: `npm ${version} encontrado` };
  } catch (e) {
    return { passed: false, message: 'npm não encontrado' };
  }
});

check('Arquivo docker-compose.yml', () => {
  const file = path.join(rootDir, 'docker-compose.yml');
  return {
    passed: fs.existsSync(file),
    message: fs.existsSync(file)
      ? 'docker-compose.yml encontrado'
      : 'docker-compose.yml não encontrado',
  };
});

check('Arquivo .env', () => {
  const file = path.join(rootDir, '.env');
  return {
    passed: fs.existsSync(file),
    message: fs.existsSync(file)
      ? '.env encontrado'
      : '.env não encontrado (criar com: npm run docker:init)',
  };
});

check('Script watch-docker.js', () => {
  const file = path.join(rootDir, 'scripts', 'watch-docker.js');
  return {
    passed: fs.existsSync(file),
    message: fs.existsSync(file) ? 'watch-docker.js encontrado' : 'watch-docker.js não encontrado',
  };
});

check('Script docker-command.js', () => {
  const file = path.join(rootDir, 'scripts', 'docker-command.js');
  return {
    passed: fs.existsSync(file),
    message: fs.existsSync(file)
      ? 'docker-command.js encontrado'
      : 'docker-command.js não encontrado',
  };
});

check('Dependência concurrently', () => {
  try {
    const pkgJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
    const hasConcurrently = pkgJson.devDependencies?.concurrently;
    return {
      passed: !!hasConcurrently,
      message: hasConcurrently
        ? 'concurrently instalado'
        : 'concurrently não encontrado em devDependencies',
    };
  } catch (e) {
    return { passed: false, message: 'Erro ao verificar package.json' };
  }
});

// Exibir resultados
console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║       Verificação de Configuração Docker               ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

let allPassed = true;

checks.forEach(({ name, passed, message }) => {
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name.padEnd(30)} ${message}`);
  if (!passed) allPassed = false;
});

console.log('\n' + '='.repeat(56));

if (allPassed) {
  console.log('\n✅ Tudo pronto! Execute:\n');
  console.log('   npm run dev\n');
} else {
  console.log('\n❌ Alguns problemas foram encontrados.');
  console.log('   Verifique as mensagens acima.\n');
  process.exit(1);
}
