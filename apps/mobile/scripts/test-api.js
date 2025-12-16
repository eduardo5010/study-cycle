#!/usr/bin/env node

const https = require('https');
const http = require('http');

/**
 * Script para testar a conectividade com a API backend
 * Verifica se o mobile consegue acessar o servidor local
 */

function testApiConnection(apiUrl, apiBaseUrl) {
  return new Promise((resolve, reject) => {
    console.log('🔍 Testando conexão com a API...');
    console.log(`🌐 URL: ${apiUrl}`);
    console.log(`🔗 Base URL: ${apiBaseUrl}`);

    const url = new URL(`${apiUrl}/health`);
    const client = url.protocol === 'https:' ? https : http;

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'GET',
      timeout: 5000,
      headers: {
        'User-Agent': 'StudyCycle-Mobile-Test/1.0',
        'Accept': 'application/json',
      },
    };

    const req = client.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const response = JSON.parse(data);
            console.log('✅ Conexão bem-sucedida!');
            console.log(`📊 Status: ${res.statusCode}`);
            console.log(`📝 Resposta: ${JSON.stringify(response, null, 2)}`);
            resolve(true);
          } else {
            console.log('❌ Resposta inesperada do servidor');
            console.log(`📊 Status: ${res.statusCode}`);
            console.log(`📝 Resposta: ${data}`);
            resolve(false);
          }
        } catch (error) {
          console.log('❌ Erro ao processar resposta JSON');
          console.log(`📝 Resposta: ${data}`);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Erro de conexão:');
      console.log(`   ${error.code}: ${error.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log('⏰ Timeout: Servidor não respondeu em 5 segundos');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

function showNetworkHelp() {
  console.log('');
  console.log('🔧 Solução de problemas de rede:');
  console.log('');
  console.log('1. 📱 Para Android Emulator:');
  console.log('   • Use: http://10.0.2.2:3001');
  console.log('   • Execute: npm run setup-ip');
  console.log('');
  console.log('2. 📱 Para iOS Simulator/Dispositivo físico:');
  console.log('   • Use o IP da sua máquina (ex: 192.168.0.10)');
  console.log('   • Execute: npm run setup-ip');
  console.log('');
  console.log('3. 🔍 Verificar se a API está rodando:');
  console.log('   • Execute: npm run dev (na raiz do monorepo)');
  console.log('   • Teste: curl http://localhost:3001/health');
  console.log('');
  console.log('4. 🛡️ Verificar firewall:');
  console.log('   • Permita conexões na porta 3001');
  console.log('   • Desative firewall temporariamente para teste');
}

async function main() {
  try {
    // Tentar ler variáveis do .env
    let apiUrl = process.env.API_URL;
    let apiBaseUrl = process.env.API_BASE_URL;

    if (!apiUrl) {
      // Tentar ler do arquivo .env
      const fs = require('fs');
      const path = require('path');
      const envPath = path.join(__dirname, '../.env');

      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const apiUrlMatch = envContent.match(/API_URL=(.+)/);
        const apiBaseUrlMatch = envContent.match(/API_BASE_URL=(.+)/);

        if (apiUrlMatch) apiUrl = apiUrlMatch[1];
        if (apiBaseUrlMatch) apiBaseUrl = apiBaseUrlMatch[1];
      }
    }

    // Valores padrão
    apiUrl = apiUrl || 'http://192.168.0.10:3001';
    apiBaseUrl = apiBaseUrl || 'http://192.168.0.10:3001/api';

    console.log('🚀 StudyCycle Mobile - Teste de API');
    console.log('=====================================');

    const isConnected = await testApiConnection(apiUrl, apiBaseUrl);

    if (isConnected) {
      console.log('');
      console.log('🎉 Tudo funcionando! O app mobile pode se conectar à API.');
      console.log('📱 Agora você pode executar: npm start');
    } else {
      console.log('');
      console.log('⚠️  Problema de conectividade detectado.');
      showNetworkHelp();
    }

  } catch (error) {
    console.error('❌ Erro ao executar teste:', error.message);
    showNetworkHelp();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { testApiConnection };
