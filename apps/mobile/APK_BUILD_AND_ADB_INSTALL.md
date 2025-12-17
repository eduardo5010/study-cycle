# 📱 Guia: Build APK com EAS + Instalação via ADB

## ✨ Novos Scripts NPM

O projeto agora possui scripts otimizados para gerar APK com validação automática de versões:

### Scripts Disponíveis

```json
{
  "scripts": {
    "validate": "node validate-build.js",
    "build:apk": "npm run validate && eas build --platform android --profile preview",
    "build:apk:dev": "npm run validate && eas build --platform android --profile development",
    "build:apk:local": "npm run validate && eas build --platform android --local",
    "build:apk:verbose": "npm run validate && eas build --platform android --profile preview --verbose",
    "builds:list": "eas build:list --platform android"
  }
}
```

---

## 🔍 Validação Automática

Antes de cada build, o script `validate-build.js` verifica:

✅ **Versão do Expo**: Deve ser **54.x.x**  
✅ **Versão do React**: Deve ser **18.2.0**  
✅ **Versão do React Native**: Deve ser **0.76.0**  
✅ **Configuração Android**: app.json e eas.json validados  
✅ **Build Type**: Confirma que é APK (não AAB)

### Como a Validação Funciona

Cada script executa:

```bash
npm run validate && eas build ...
```

Se a validação falhar, o build não é iniciado.

---

## 🚀 Gerando o APK

### Opção 1: Profile Preview (Recomendado)

```bash
npm run build:apk
```

**Características:**

- Build otimizado para testes
- Versão release (mais rápido que debug)
- Formato: **APK**
- Tempo: ~5-10 minutos

**Melhor para:** QA, stakeholders, testes gerais

### Opção 2: Profile Development

```bash
npm run build:apk:dev
```

**Características:**

- Build debug (com mais logging)
- Formato: **APK**
- Tempo: ~5-10 minutos

**Melhor para:** Desenvolvimento, troubleshooting

### Opção 3: Build Local

```bash
npm run build:apk:local
```

**Características:**

- Compila localmente (requer Android SDK)
- Mais rápido se Android Studio está instalado
- Formato: **APK**
- Tempo: ~3-5 minutos

**Melhor para:** Desenvolvimento rápido, CI/CD local

### Opção 4: Build Verbose (Diagnóstico)

```bash
npm run build:apk:verbose
```

**Características:**

- Mesmo que `build:apk` mas com logs detalhados
- Útil para troubleshooting
- Tempo: ~5-10 minutos

**Melhor para:** Debugging de issues

---

## 📥 Verificando Versões

Antes de fazer build, você pode verificar as versões instaladas:

```bash
npm run validate
```

Saída esperada:

```
✓ expo: ^54.0.0
✓ react: 18.2.0
✓ react-native: 0.76.0
✓ react-dom: 18.2.0
✓ app.json: Configurado para Android
✓ eas.json: Configurado com perfil preview
✓ Build type: APK (correto)

✅ Todas as versões estão corretas!
```

---

## 📊 Monitorando o Build

### 1. Dashboard EAS

Abra: https://expo.dev/builds

Você verá:

- Status em tempo real
- Logs detalhados
- Links de download
- QR code para instalar

### 2. Terminal

O terminal mostrará:

```
Building for Android...
Build submitted successfully!
Visit https://expo.dev/builds/... to view your build
```

### 3. Email

Você receberá um email quando o build estiver pronto.

---

## 💾 Baixando o APK

### Método 1: Dashboard (Recomendado)

1. Acesse: https://expo.dev/builds
2. Encontre seu build (status: **FINISHED**)
3. Clique em **Download** para baixar o `.apk`
4. Salve em uma pasta conhecida

### Método 2: Link Direto

Do output do terminal, copie o link e cole no navegador:

```
https://expo.dev/builds/...
```

---

## 📱 Instalando no Celular via ADB

### Pré-requisitos

1. **Android SDK instalado**

   ```bash
   # Verificar se adb está disponível
   adb --version
   ```

2. **Celular conectado via USB**
   - Ativar modo de desenvolvedor
   - Ativar depuração USB
   - Autorizar a conexão no celular

### Passo 1: Conectar Dispositivo

```bash
# Conectar celular via USB
# Autorizar acesso no popup do celular

# Verificar conexão
adb devices
```

Saída esperada:

```
List of attached devices
ABC123D4567890    device
```

Se aparecer `unauthorized`, reconecte o USB e autorize novamente no celular.

### Passo 2: Instalar APK

```bash
# Instalar o APK
adb install /caminho/para/studycycle.apk

# Exemplo (Windows)
adb install "C:\Users\eduar\Downloads\studycycle.apk"

# Exemplo (Mac/Linux)
adb install ~/Downloads/studycycle.apk
```

Saída esperada:

```
Success
```

### Passo 3: Verificar Instalação

```bash
# Verificar se o app foi instalado
adb shell pm list packages | grep studycycle

# Saída esperada
package:com.studycycle.mobile
```

### Passo 4: Abrir o App

```bash
# Abrir o app no celular
adb shell am start -n com.studycycle.mobile/.MainActivity
```

---

## 🔄 Atualizar App Existente

Se você já tem o app instalado e quer atualizar:

```bash
# Opção 1: Instalar de novo (sobrescreve)
adb install /caminho/para/novo.apk

# Opção 2: Reinstalar (remove e instala)
adb install -r /caminho/para/novo.apk

# Opção 3: Remover primeiro
adb uninstall com.studycycle.mobile
adb install /caminho/para/novo.apk
```

---

## 🗑️ Desinstalando

```bash
# Desinstalar o app
adb uninstall com.studycycle.mobile

# Verificar que foi removido
adb shell pm list packages | grep studycycle
# (não deve retornar nada)
```

---

## 📊 Verificando Logs

```bash
# Ver logs em tempo real
adb logcat | grep StudyCycle

# Ver apenas os últimos 50 logs
adb logcat -t 50 | grep StudyCycle

# Salvar logs em arquivo
adb logcat > logs.txt
# Apertar Ctrl+C para parar
```

---

## 🐛 Troubleshooting

### ❌ "adb: command not found"

**Solução:**

1. Instale Android SDK: https://developer.android.com/tools/releases/platform-tools
2. Adicione ao PATH:
   - **Windows**: `C:\Users\[user]\AppData\Local\Android\Sdk\platform-tools`
   - **Mac/Linux**: `~/Android/Sdk/platform-tools`

### ❌ "No devices found"

**Solução:**

1. Desconecte e reconecte o USB
2. Reinicie o servidor adb:
   ```bash
   adb kill-server
   adb start-server
   adb devices
   ```
3. Verifique se modo desenvolvedor está ativado
4. Autorize a conexão no popup do celular

### ❌ "Installation failed: INSTALL_FAILED_INVALID_APK"

**Solução:**

1. Verifique se o arquivo APK não está corrompido
2. Re-baixe o APK do dashboard
3. Tente instalar novamente

### ❌ "Build não aparece no dashboard"

**Solução:**

1. Aguarde 2-3 minutos
2. Atualize a página
3. Verifique se está na conta Expo correta:
   ```bash
   eas whoami
   ```

### ❌ "Validação falha com erro de versão"

**Solução:**

```bash
# Instalar versões corretas
npm install expo@54 react@18.2.0 react-native@0.76.0

# Tentar novamente
npm run validate
```

---

## ✅ Checklist Pré-Build

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] EAS CLI instalado (`eas --version`)
- [ ] Autenticado com EAS (`eas whoami`)
- [ ] Validação passa (`npm run validate`)
- [ ] `.env` configurado corretamente
- [ ] API backend rodando (se testando)
- [ ] Internet estável
- [ ] Espaço em disco disponível (>1GB)

---

## ✅ Checklist Pós-Install (ADB)

- [ ] Android SDK instalado
- [ ] Celular conectado via USB
- [ ] Modo desenvolvedor ativado
- [ ] Depuração USB ativada
- [ ] Conexão autorizada no celular
- [ ] APK instalou com sucesso
- [ ] App abre sem erros
- [ ] Pode fazer login/teste básico

---

## 📚 Referências Rápidas

```bash
# Verificar versão
npm run validate

# Build preview
npm run build:apk

# Ver builds recentes
npm run builds:list

# Conectar dispositivo
adb devices

# Instalar APK
adb install /caminho/apk

# Ver logs
adb logcat | grep StudyCycle

# Desinstalar
adb uninstall com.studycycle.mobile
```

---

## 🎯 Fluxo Completo

```
1. npm run build:apk              ← Valida e inicia build
2. Aguarda 5-10 min               ← Build na nuvem
3. Download do APK                ← Da https://expo.dev/builds
4. adb devices                    ← Verifica conexão
5. adb install studycycle.apk     ← Instala no celular
6. App aparece na tela inicial    ← Pronto!
7. Testa funcionalidades          ← QA/Feedback
```

---

## 💡 Dicas Pro

1. **Reutilizar build**: Você pode instalar o mesmo APK em vários celulares via ADB
2. **Compartilhar APK**: Envie o arquivo `.apk` para outros testadores
3. **Pipeline CI/CD**: Configure `npm run build:apk` em seu GitHub Actions/GitLab CI
4. **Múltiplos dispositivos**:
   ```bash
   # Instalar em todos os dispositivos conectados
   for device in $(adb devices | grep device | awk '{print $1}' | grep -v devices); do
     adb -s $device install app.apk
   done
   ```

---

**Status**: ✅ Pronto para usar  
**Última atualização**: 16/12/2025  
**Versão**: 1.0.0
