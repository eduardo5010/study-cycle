#!/usr/bin/env node

/**
 * 🔍 Validador de Versões para Build APK
 *
 * Verifica se todas as dependências estão com as versões corretas
 * antes de fazer o build do APK.
 *
 * Uso: node validate-build.js
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_VERSIONS = {
  expo: '^54.0.0',
  react: '18.2.0',
  'react-native': '0.76.0',
  'react-dom': '18.2.0',
};

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function success(msg) {
  log(`✓ ${msg}`, 'green');
}
function error(msg) {
  log(`✗ ${msg}`, 'red');
}
function warn(msg) {
  log(`⚠ ${msg}`, 'yellow');
}
function info(msg) {
  log(`ℹ ${msg}`, 'blue');
}

function parseVersion(version) {
  // Remove ^, ~, >, <, =, etc
  const clean = version.replace(/^[\^~>=<]+/, '');
  const parts = clean.split('.');
  return {
    major: parseInt(parts[0]) || 0,
    minor: parseInt(parts[1]) || 0,
    patch: parseInt(parts[2]) || 0,
    raw: clean,
  };
}

function checkVersion(actual, required) {
  const act = parseVersion(actual);
  const req = parseVersion(required);

  // Se required começa com ^, verifica major.minor
  if (required.startsWith('^')) {
    if (act.major === req.major) {
      if (act.minor >= req.minor) {
        return { valid: true, reason: 'ok' };
      }
    }
    return { valid: false, reason: 'minor-version-too-old' };
  }

  // Se required é exato (sem ^~><=)
  if (!required.match(/^[\^~>=<]/)) {
    if (actual === required) {
      return { valid: true, reason: 'exact-match' };
    }
    return { valid: false, reason: 'version-mismatch' };
  }

  return { valid: true, reason: 'ok' };
}

async function main() {
  console.log('\n');
  log('╔════════════════════════════════════════╗', 'blue');
  log('║   APK BUILD VALIDATOR                  ║', 'blue');
  log('║   Verificando versões de dependências  ║', 'blue');
  log('╚════════════════════════════════════════╝', 'blue');
  console.log('\n');

  const packageJsonPath = path.join(__dirname, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    error('package.json não encontrado!');
    process.exit(1);
  }

  const packageJson = require(packageJsonPath);
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  let hasErrors = false;
  let hasWarnings = false;

  info('Verificando versões críticas:\n');

  for (const [pkg, requiredVersion] of Object.entries(REQUIRED_VERSIONS)) {
    const actualVersion = allDeps[pkg];

    if (!actualVersion) {
      error(`${pkg}: NÃO INSTALADO`);
      hasErrors = true;
      continue;
    }

    const check = checkVersion(actualVersion, requiredVersion);

    if (check.valid) {
      success(`${pkg}: ${actualVersion} (required: ${requiredVersion})`);
    } else {
      if (pkg === 'expo' && requiredVersion.startsWith('^')) {
        // Expo com ^ é mais flexível
        warn(`${pkg}: ${actualVersion} (recomendado: ${requiredVersion})`);
        hasWarnings = true;
      } else {
        error(`${pkg}: ${actualVersion} (required: ${requiredVersion})`);
        hasErrors = true;
      }
    }
  }

  console.log('\n');

  // Verificar app.json
  info('Verificando configurações:\n');

  const appJsonPath = path.join(__dirname, 'app.json');
  if (fs.existsSync(appJsonPath)) {
    const appJson = require(appJsonPath);

    if (appJson.expo && appJson.expo.android) {
      success(`app.json: Configurado para Android`);
      if (appJson.expo.android.package) {
        success(`Package: ${appJson.expo.android.package}`);
      }
    }
  }

  // Verificar eas.json
  const easJsonPath = path.join(__dirname, 'eas.json');
  if (fs.existsSync(easJsonPath)) {
    const easJson = require(easJsonPath);

    if (easJson.build && easJson.build.preview && easJson.build.preview.android) {
      success(`eas.json: Configurado com perfil preview`);
      if (easJson.build.preview.android.buildType === 'apk') {
        success(`Build type: APK (correto)`);
      }
    }
  }

  console.log('\n');

  if (hasErrors) {
    error('\n❌ ERROS ENCONTRADOS! Corrija antes de fazer o build.\n');
    process.exit(1);
  }

  if (hasWarnings) {
    warn('\n⚠️  Avisos encontrados, mas pode funcionar.\n');
  } else {
    success('\n✅ Todas as versões estão corretas!\n');
  }

  info('Você pode fazer o build com:\n');
  log('  npm run build:apk', 'yellow');
  log('  npm run build:apk:preview', 'yellow');
  console.log('\n');
}

main().catch((err) => {
  error(`Erro: ${err.message}`);
  process.exit(1);
});
