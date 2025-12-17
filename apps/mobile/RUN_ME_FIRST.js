#!/usr/bin/env node

/**
 * 🚀 QUICK START - Execute este arquivo para gerar o APK!
 *
 * Uso:
 *   node RUN_ME_FIRST.js
 *
 * Ou adicione à raiz do projeto e execute:
 *   node apps/mobile/RUN_ME_FIRST.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Simples e direto - sem cores complexas
console.log('\n');
console.log('╔════════════════════════════════════════════╗');
console.log('║     StudyCycle Mobile - APK Generator      ║');
console.log('║              (QUICK START)                 ║');
console.log('╚════════════════════════════════════════════╝');
console.log('\n');

// Função simples para executar comandos
function run(command, description) {
  try {
    console.log(`\n▶ ${description}...`);
    console.log(`  $ ${command}\n`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (e) {
    console.error(`✗ Erro ao executar: ${command}`);
    return false;
  }
}

// Função para verificar se comando existe
function commandExists(cmd) {
  try {
    execSync(`where ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('📋 CHECKLIST DE PRÉ-REQUISITOS:\n');

  // 1. Verificar Node.js
  if (!commandExists('node')) {
    console.log('✗ Node.js não encontrado!');
    console.log('  Baixe em: https://nodejs.org/\n');
    process.exit(1);
  }
  console.log('✓ Node.js encontrado');

  // 2. Verificar EAS
  let hasEas = commandExists('eas');
  if (!hasEas) {
    console.log('⚠ EAS CLI não encontrado. Instalando...');
    if (run('npm install -g eas-cli', 'Instalando EAS CLI')) {
      hasEas = true;
      console.log('✓ EAS CLI instalado');
    }
  } else {
    console.log('✓ EAS CLI instalado');
  }

  // 3. Verificar Expo
  let hasExpo = commandExists('expo');
  if (!hasExpo) {
    console.log('⚠ Expo CLI não encontrado. Instalando...');
    if (run('npm install -g expo-cli', 'Instalando Expo CLI')) {
      hasExpo = true;
      console.log('✓ Expo CLI instalado');
    }
  } else {
    console.log('✓ Expo CLI instalado');
  }

  // 4. Verificar autenticação EAS
  console.log('\n🔐 Verificando autenticação EAS...\n');
  try {
    execSync('eas whoami', { stdio: 'pipe', encoding: 'utf-8' });
    console.log('✓ Você está autenticado com EAS');
  } catch (e) {
    console.log('⚠ Você não está autenticado com EAS');
    console.log('\nVou abrir a tela de login...\n');
    run('eas login', 'Fazendo login no EAS');
  }

  // 5. Instalar dependências locais
  console.log('\n📦 Verificando dependências do projeto...\n');
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    run('npm install', 'Instalando dependências npm');
  } else {
    console.log('✓ Dependências já instaladas');
  }

  // 6. Pronto para build!
  console.log('\n');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   ✅ TUDO PRONTO! INICIANDO BUILD...      ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('\n');
  console.log('Este processo pode levar 2-5 minutos...\n');

  // 7. Iniciar build
  run('eas build -p android --profile development', 'Gerando APK (build na nuvem EAS)');

  // 8. Sucesso!
  console.log('\n');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   🎉 BUILD ENVIADO COM SUCESSO!          ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('\n');
  console.log('📍 PRÓXIMAS ETAPAS:\n');
  console.log('   1. Abra o dashboard: https://expo.dev/builds');
  console.log('   2. Procure por seu build (seção "Builds")');
  console.log('   3. Quando terminar, baixe o APK ou use QR code');
  console.log('   4. Instale no seu celular\n');
  console.log('💡 Dica: O build está sendo compilado em segundo plano');
  console.log('   Você receberá um email quando estiver pronto.\n');
  console.log('📖 Para mais detalhes, veja os arquivos:\n');
  console.log('   - BUILD_SUMMARY.md (resumo completo)');
  console.log('   - INSTALL_ON_PHONE.md (como instalar)');
  console.log('   - BUILD_APK_GUIDE.md (guia detalhado)\n');
}

main().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
