#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Script para configurar automaticamente o IP da máquina no arquivo .env do mobile
 * Facilita a troca entre diferentes ambientes de desenvolvimento
 */

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  // Procurar por interfaces de rede ativas
  for (const interfaceName of Object.keys(interfaces)) {
    const interfaceInfo = interfaces[interfaceName];

    for (const info of interfaceInfo) {
      // IPv4, não interna, e não localhost
      if (info.family === 'IPv4' && !info.internal && info.address !== '127.0.0.1') {
        addresses.push({
          interface: interfaceName,
          address: info.address,
          netmask: info.netmask,
        });
      }
    }
  }

  // Preferir interfaces Wi-Fi/Ethernet sobre outras
  const wifiInterface = addresses.find(addr =>
    addr.interface.toLowerCase().includes('wi-fi') ||
    addr.interface.toLowerCase().includes('wlan') ||
    addr.interface.toLowerCase().includes('en0') ||
    addr.interface.toLowerCase().includes('eth0')
  );

  return wifiInterface?.address || addresses[0]?.address || '192.168.0.10';
}

function updateEnvFile(ipAddress) {
  const envPath = path.join(__dirname, '../.env');
  const envExamplePath = path.join(__dirname, '../.env.example');

  console.log('🔍 Detectando configurações de IP...');
  console.log(`📱 IP da máquina detectado: ${ipAddress}`);

  // Ler arquivo .env existente ou usar exemplo
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    console.log('📄 Arquivo .env encontrado, atualizando...');
  } else if (fs.existsSync(envExamplePath)) {
    envContent = fs.readFileSync(envExamplePath, 'utf8');
    console.log('📄 Usando .env.example como base...');
  } else {
    console.log('❌ Nenhum arquivo .env encontrado!');
    return;
  }

  // Atualizar as URLs da API
  const updatedContent = envContent
    .replace(/API_URL=.*/, `API_URL=http://${ipAddress}:3001`)
    .replace(/API_BASE_URL=.*/, `API_BASE_URL=http://${ipAddress}:3001/api`);

  // Escrever arquivo .env
  fs.writeFileSync(envPath, updatedContent, 'utf8');

  console.log('✅ Arquivo .env atualizado com sucesso!');
  console.log(`🌐 API_URL: http://${ipAddress}:3001`);
  console.log(`🔗 API_BASE_URL: http://${ipAddress}:3001/api`);
  console.log('');
  console.log('📋 Configurações especiais por plataforma:');
  console.log('🤖 Android Emulator: Use 10.0.2.2 em vez do IP da máquina');
  console.log('📱 iOS Simulator: Use o IP detectado acima');
  console.log('📱 Dispositivo físico: Use o IP detectado acima');
  console.log('');
  console.log('🚀 Para testar a conexão:');
  console.log(`curl http://${ipAddress}:3001/health`);
}

function showUsage() {
  console.log('🔧 StudyCycle Mobile - Configuração de IP');
  console.log('');
  console.log('Este script configura automaticamente o IP da sua máquina');
  console.log('para que o app mobile possa acessar a API local.');
  console.log('');
  console.log('📖 Plataformas suportadas:');
  console.log('  • Android Emulator: 10.0.2.2');
  console.log('  • iOS Simulator: IP da máquina');
  console.log('  • Dispositivo físico: IP da máquina');
  console.log('');
  console.log('💡 Para configurar manualmente:');
  console.log('  1. Abra apps/mobile/.env');
  console.log('  2. Atualize API_URL e API_BASE_URL');
  console.log('  3. Reinicie o Metro bundler');
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    showUsage();
    return;
  }

  try {
    const ipAddress = getLocalIP();

    if (!ipAddress) {
      console.error('❌ Não foi possível detectar o IP da máquina!');
      console.log('');
      console.log('💡 Verifique sua conexão de rede e tente novamente.');
      console.log('💡 Ou configure manualmente no arquivo .env');
      return;
    }

    updateEnvFile(ipAddress);
  } catch (error) {
    console.error('❌ Erro ao configurar IP:', error.message);
    console.log('');
    console.log('💡 Tente configurar manualmente no arquivo .env');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { getLocalIP, updateEnvFile };
