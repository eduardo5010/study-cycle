#!/usr/bin/env node

/**
 * 🤖 ADB Install Helper
 *
 * Script auxiliar para instalar APK via ADB com validações
 * e tratamento de erros.
 *
 * Uso:
 *   npm run adb:install -- /caminho/para/app.apk
 *   node adb-install.js /caminho/para/app.apk
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
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
function step(msg) {
  log(`→ ${msg}`, 'cyan');
}

function executeCommand(cmd, silent = false) {
  try {
    const output = execSync(cmd, {
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit',
    });
    return { success: true, output };
  } catch (e) {
    return { success: false, error: e.message, output: e.stdout };
  }
}

async function main() {
  console.log('\n');
  log('╔════════════════════════════════════════╗', 'blue');
  log('║   ADB Install Helper                   ║', 'blue');
  log('║   Instalador de APK via ADB            ║', 'blue');
  log('╚════════════════════════════════════════╝', 'blue');
  console.log('\n');

  // 1. Obter caminho do APK
  let apkPath = process.argv[2];

  if (!apkPath) {
    error('❌ Nenhum APK fornecido!');
    console.log('\nUso:');
    console.log('  npm run adb:install -- /caminho/para/app.apk');
    console.log('  node adb-install.js /caminho/para/app.apk\n');
    process.exit(1);
  }

  // Converter para caminho absoluto
  apkPath = path.resolve(apkPath);

  step(`Verificando APK: ${apkPath}\n`);

  // 2. Verificar se arquivo existe
  if (!fs.existsSync(apkPath)) {
    error(`Arquivo não encontrado: ${apkPath}`);
    process.exit(1);
  }
  success(`Arquivo encontrado (${getFileSize(apkPath)})`);

  // 3. Verificar se é um APK válido
  if (!apkPath.endsWith('.apk')) {
    warn('⚠️  Arquivo pode não ser um APK válido (não termina com .apk)');
  }

  // 4. Verificar ADB
  info('Verificando ADB...\n');
  const adbCheck = executeCommand('adb --version', true);
  if (!adbCheck.success) {
    error('ADB não encontrado! Instale Android SDK Platform Tools');
    console.log('Download: https://developer.android.com/tools/releases/platform-tools\n');
    process.exit(1);
  }
  success('ADB disponível');

  // 5. Verificar dispositivos
  info('Procurando dispositivos conectados...\n');
  const devicesResult = executeCommand('adb devices', true);

  if (!devicesResult.success) {
    error('Erro ao listar dispositivos');
    process.exit(1);
  }

  const lines = devicesResult.output.split('\n');
  const devices = lines
    .slice(1) // Skip header
    .filter((line) => line.trim() && line.includes('device'))
    .map((line) => line.split('\t')[0].trim())
    .filter((id) => id && !id.includes('daemon'));

  if (devices.length === 0) {
    error('Nenhum dispositivo encontrado!');
    console.log('\nPossíveis soluções:');
    console.log('  1. Conecte um celular via USB');
    console.log('  2. Ative "Modo de Desenvolvedor" no celular');
    console.log('  3. Ative "Depuração USB" nas configurações');
    console.log('  4. Autorize a conexão no popup do celular\n');
    process.exit(1);
  }

  success(`${devices.length} dispositivo(s) encontrado(s)`);
  devices.forEach((device, idx) => {
    log(`  ${idx + 1}. ${device}`, 'cyan');
  });

  console.log('\n');

  // 6. Instalar em cada dispositivo
  let successCount = 0;
  let errorCount = 0;

  for (const device of devices) {
    step(`Instalando em: ${device}\n`);

    const installResult = executeCommand(`adb -s ${device} install "${apkPath}"`);

    if (installResult.success && installResult.output.includes('Success')) {
      success(`Instalado com sucesso em ${device}`);
      successCount++;
    } else {
      // Tentar reinstalar se já existe
      warn(`Tentando reinstalar (pode já estar instalado)...`);
      const reinstallResult = executeCommand(`adb -s ${device} install -r "${apkPath}"`);

      if (reinstallResult.success && reinstallResult.output.includes('Success')) {
        success(`Reinstalado com sucesso em ${device}`);
        successCount++;
      } else {
        error(`Falha ao instalar em ${device}`);
        if (reinstallResult.output) {
          console.log(`  ${reinstallResult.output}`);
        }
        errorCount++;
      }
    }
    console.log();
  }

  // 7. Resultado final
  console.log('\n');
  log('╔════════════════════════════════════════╗', 'blue');
  if (errorCount === 0) {
    log('║   ✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO  ║', 'green');
  } else if (successCount > 0) {
    log('║   ⚠️  INSTALAÇÃO PARCIAL CONCLUÍDA     ║', 'yellow');
  } else {
    log('║   ✗ FALHA NA INSTALAÇÃO               ║', 'red');
  }
  log('╚════════════════════════════════════════╝', 'blue');
  console.log();

  info(`Resumo: ${successCount} sucesso(s), ${errorCount} erro(s)`);

  // 8. Opções pós-install
  if (successCount > 0) {
    console.log('\n');
    info('Opções disponíveis:\n');
    log('  1. Abrir app:', 'cyan');
    log('     adb shell am start -n com.studycycle.mobile/.MainActivity', 'yellow');
    log('  2. Ver logs:', 'cyan');
    log('     adb logcat | grep StudyCycle', 'yellow');
    log('  3. Desinstalar:', 'cyan');
    log('     adb uninstall com.studycycle.mobile', 'yellow');
    console.log();
  }

  process.exit(errorCount === 0 ? 0 : 1);
}

function getFileSize(filePath) {
  const bytes = fs.statSync(filePath).size;
  const mb = (bytes / 1024 / 1024).toFixed(2);
  return `${mb} MB`;
}

main().catch((err) => {
  error(`Erro: ${err.message}`);
  process.exit(1);
});
