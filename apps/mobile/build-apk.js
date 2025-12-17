#!/usr/bin/env node

/**
 * Script para gerar APK do app mobile com EAS CLI
 * Este script automatiza o processo de build para testes no celular
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(message, 'red');
  process.exit(1);
}

function success(message) {
  log(message, 'green');
}

function info(message) {
  log(message, 'blue');
}

function warn(message) {
  log(message, 'yellow');
}

async function checkPrerequisites() {
  info('\n📋 Verificando pré-requisitos...\n');

  // Verificar Node.js
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
    success(`✓ Node.js ${nodeVersion}`);
  } catch (e) {
    error('✗ Node.js não encontrado. Instale em: https://nodejs.org/');
  }

  // Verificar npm
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
    success(`✓ npm ${npmVersion}`);
  } catch (e) {
    error('✗ npm não encontrado');
  }

  // Verificar Expo CLI
  try {
    execSync('expo --version', { encoding: 'utf-8' });
    success('✓ Expo CLI instalado');
  } catch (e) {
    warn('⚠ Expo CLI não encontrado. Instalando globalmente...');
    try {
      execSync('npm install -g expo-cli', { stdio: 'inherit' });
      success('✓ Expo CLI instalado com sucesso');
    } catch (installError) {
      error('✗ Falha ao instalar Expo CLI');
    }
  }

  // Verificar EAS CLI
  try {
    execSync('eas --version', { encoding: 'utf-8' });
    success('✓ EAS CLI instalado');
  } catch (e) {
    warn('⚠ EAS CLI não encontrado. Instalando globalmente...');
    try {
      execSync('npm install -g eas-cli', { stdio: 'inherit' });
      success('✓ EAS CLI instalado com sucesso');
    } catch (installError) {
      error('✗ Falha ao instalar EAS CLI');
    }
  }

  // Verificar autenticação EAS
  info('\n🔐 Verificando autenticação EAS...\n');
  try {
    execSync('eas whoami', { encoding: 'utf-8' });
    success('✓ Autenticado com EAS');
  } catch (e) {
    warn('⚠ Não autenticado com EAS. Faça login...');
    try {
      execSync('eas login', { stdio: 'inherit' });
      success('✓ Login realizado');
    } catch (loginError) {
      error('✗ Falha ao fazer login no EAS');
    }
  }
}

async function checkDependencies() {
  info('\n📦 Verificando dependências do projeto...\n');

  const packageJsonPath = path.join(__dirname, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    error('✗ package.json não encontrado');
  }

  const packageJson = require(packageJsonPath);

  // Verificar dependências críticas
  const criticalDeps = ['expo', 'react', 'react-native', '@react-navigation/native'];

  const missingDeps = [];

  for (const dep of criticalDeps) {
    if (!packageJson.dependencies[dep] && !packageJson.devDependencies?.[dep]) {
      missingDeps.push(dep);
    } else {
      success(`✓ ${dep}`);
    }
  }

  if (missingDeps.length > 0) {
    warn(`⚠ Dependências faltando: ${missingDeps.join(', ')}`);
    info('\nInstalando dependências...\n');
    try {
      execSync('npm install', { stdio: 'inherit', cwd: __dirname });
      success('✓ Dependências instaladas');
    } catch (e) {
      error('✗ Falha ao instalar dependências');
    }
  } else {
    success('✓ Todas as dependências estão instaladas');
  }
}

async function checkConfigFiles() {
  info('\n⚙️  Verificando arquivos de configuração...\n');

  const requiredFiles = ['app.json', 'eas.json', 'package.json'];

  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      success(`✓ ${file}`);
    } else {
      error(`✗ ${file} não encontrado`);
    }
  }

  // Verificar se o eas.json tem a configuração do Android
  const easJsonPath = path.join(__dirname, 'eas.json');
  const easJson = require(easJsonPath);

  if (!easJson.build.development.android) {
    error('✗ eas.json não tem configuração para Android');
  }

  success('✓ eas.json configurado para Android');
}

async function buildApk() {
  info('\n🚀 Iniciando build do APK...\n');
  info('Perfil: development');
  info('Tipo: internal (para testes)\n');

  try {
    execSync('eas build -p android --profile development', {
      stdio: 'inherit',
      cwd: __dirname,
    });
    success('\n✓ APK compilado com sucesso!');
  } catch (e) {
    error('✗ Falha durante o build');
  }
}

async function main() {
  console.clear();
  log('\n╔════════════════════════════════════════╗', 'blue');
  log('║  StudyCycle Mobile - APK Build Script  ║', 'blue');
  log('╚════════════════════════════════════════╝\n', 'blue');

  try {
    await checkPrerequisites();
    await checkDependencies();
    await checkConfigFiles();
    await buildApk();

    info('\n');
    log('╔════════════════════════════════════════╗', 'green');
    log('║     BUILD CONCLUÍDO COM SUCESSO!      ║', 'green');
    log('╚════════════════════════════════════════╝', 'green');

    info('\n📱 Próximos passos:');
    info('1. Acesse o dashboard do EAS: https://expo.dev/');
    info('2. Encontre seu build na aba de builds');
    info('3. Escaneie o QR code com seu celular ou baixe o APK diretamente');
    info('4. Instale o APK no seu dispositivo\n');
  } catch (e) {
    error(`\n✗ Erro: ${e.message}`);
  }
}

main();
