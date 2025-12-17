# 📱 Guia Completo de Build do APK - StudyCycle Mobile

## 🎯 Objetivo

Este guia fornece instruções passo a passo para gerar um APK do app mobile StudyCycle para testar no seu celular Android.

## 📋 Pré-requisitos

### Instalação Necessária

1. **Node.js** (v18 ou superior)
   - Download: https://nodejs.org/
   - Verificar: `node --version`

2. **npm** (vem com Node.js)
   - Verificar: `npm --version`

3. **Expo CLI**

   ```bash
   npm install -g expo-cli
   ```

4. **EAS CLI** (para builds mais robustos)

   ```bash
   npm install -g eas-cli
   ```

5. **Conta Expo** (gratuita)
   - Criar em: https://expo.dev/signup

## 🚀 Opção 1: Build Automático (Recomendado)

### Passo 1: Navigate para a pasta do app mobile

```bash
cd apps/mobile
```

### Passo 2: Execute o script de build

```bash
node build-apk.js
```

Este script irá:

- ✓ Verificar todos os pré-requisitos
- ✓ Confirmar dependências do projeto
- ✓ Validar configurações
- ✓ Iniciar o build do APK
- ✓ Fornecer instruções para baixar o APK

## 🚀 Opção 2: Build Manual com EAS

### Passo 1: Navigate para a pasta do app mobile

```bash
cd apps/mobile
```

### Passo 2: Faça login no EAS

```bash
eas login
```

### Passo 3: Verifique a autenticação

```bash
eas whoami
```

### Passo 4: Iniciar o build

```bash
eas build -p android --profile development
```

Opções alternativas:

- **Preview (build de release)**:

  ```bash
  eas build -p android --profile preview
  ```

- **Com log detalhado**:
  ```bash
  eas build -p android --profile development --verbose
  ```

## 🚀 Opção 3: Build Local com Expo

Se você tem Android Studio instalado localmente:

### Passo 1: Navigate para a pasta

```bash
cd apps/mobile
```

### Passo 2: Instale as dependências

```bash
npm install
```

### Passo 3: Execute o build local

```bash
expo run:android
```

Ou com o método moderno:

```bash
eas build -p android --local
```

## 📥 Como Baixar e Instalar o APK

### Método 1: Através do Dashboard EAS (Recomendado)

1. Vá para https://expo.dev/
2. Faça login com sua conta
3. Acesse "Builds" no menu
4. Encontre seu build mais recente
5. Clique no APK para baixar
6. Abra o arquivo no seu celular ou use:
   ```bash
   adb install <caminho-do-apk>
   ```

### Método 2: QR Code

1. Após o build concluir, você receberá um QR code
2. Escaneie com a câmera do seu Android
3. Toque em "Instalar" quando aparecer

### Método 3: Usando ADB (Android Debug Bridge)

Se você tem o Android SDK instalado:

```bash
# Conectar o celular via USB
# Verificar conexão
adb devices

# Instalar APK
adb install /caminho/para/o/arquivo.apk

# Abrir o app
adb shell am start -n com.studycycle.mobile/.MainActivity
```

## ⚙️ Configurações Importantes

### app.json

O arquivo `app.json` contém:

- Nome do app: `StudyCycle`
- Package Android: `com.studycycle.mobile`
- Versão: `1.0.0`
- Ícones e splash screens

### eas.json

Perfis de build disponíveis:

- **development**: APK de desenvolvimento (mais rápido)
- **preview**: APK para testes (sem assinatura final)
- **production**: APK para loja (com assinatura)

## 🔧 Troubleshooting

### Erro: "Command not found: eas"

**Solução**: Instale EAS CLI globalmente

```bash
npm install -g eas-cli
```

### Erro: "Not authenticated"

**Solução**: Faça login no EAS

```bash
eas login
```

### Erro: "Dependencies are out of date"

**Solução**: Reinstale as dependências

```bash
npm install
```

### Erro: "expo: command not found"

**Solução**: Instale Expo CLI globalmente

```bash
npm install -g expo-cli
```

### Build fails com erro de SDK

**Solução**: Verifique a versão do React Native em `package.json` e execute:

```bash
expo prebuild --clean
```

## 📊 Monitorar o Build

Durante o build, você pode:

1. **Acompanhar em tempo real**:
   - Dashboard: https://expo.dev/
   - Verificar logs completos

2. **Receber notificações**:
   - Email quando o build estiver pronto
   - Link direto para download

3. **Ver status**:

   ```bash
   eas build:list -p android
   ```

4. **Ver detalhes de um build**:
   ```bash
   eas build:view <build-id>
   ```

## 🔐 Configuração de Signing (Opcional)

Para builds de produção, configure o signing automático:

```bash
eas build -p android --profile production
```

O EAS gerará automaticamente as chaves de assinatura.

## 📱 Testando o App

Após instalar o APK:

1. **Abra o app** no seu celular
2. **Teste os principais fluxos**:
   - Login/Signup
   - Navegação entre telas
   - Sincronização de dados
   - Funcionalidades offline
3. **Verifique os logs** (se necessário):
   ```bash
   adb logcat | grep StudyCycle
   ```

## 🔄 Build Rápido Seguinte

Para builds subsequentes, você pode usar:

```bash
npm run build:apk
```

Que executa:

```json
"build:apk": "eas build -p android --profile development"
```

## 📚 Recursos Adicionais

- [Documentação Expo](https://docs.expo.dev/)
- [Documentação EAS Build](https://docs.expo.dev/build/introduction/)
- [React Native Documentation](https://reactnative.dev/)
- [Android Debug Bridge (ADB)](https://developer.android.com/tools/adb)

## ✅ Checklist Final

Antes de fazer o build:

- [ ] Node.js e npm instalados
- [ ] Conta Expo criada e autenticada
- [ ] `npm install` executado em `apps/mobile`
- [ ] `app.json` configurado corretamente
- [ ] `eas.json` configurado para Android
- [ ] Conexão de internet estável
- [ ] Celular Android pronto para testes

## 🆘 Suporte

Se encontrar problemas:

1. Verificar logs: `eas build:view <build-id>`
2. Limpar cache: `expo prebuild --clean`
3. Reinstalar deps: `npm ci` (cria lock file)
4. Consultar docs: https://docs.expo.dev/build/troubleshooting/

---

**Última atualização**: 16 de dezembro de 2025
**Versão do App**: 1.0.0
**Status**: ✅ Pronto para build
