# 🚀 Build APK e Instalar no Celular

## ⚡ Resumo Rápido

```bash
# 1. Validar versões
npm run validate

# 2. Gerar APK (na nuvem EAS)
npm run build:apk

# 3. Esperar 5-10 minutos, depois baixar de:
# https://expo.dev/builds

# 4. Instalar via ADB
npm run adb:install -- /caminho/para/app.apk
```

---

## 📖 Scripts Disponíveis

### Build

| Script                      | O Que Faz                                           | Tempo    |
| --------------------------- | --------------------------------------------------- | -------- |
| `npm run validate`          | Verifica versões (Expo 54, React 18.2.0, RN 0.76.0) | <1 min   |
| `npm run build:apk`         | Build profile preview (recomendado)                 | 5-10 min |
| `npm run build:apk:dev`     | Build profile development (debug)                   | 5-10 min |
| `npm run build:apk:local`   | Build local (requer Android SDK)                    | 3-5 min  |
| `npm run build:apk:verbose` | Build com logs detalhados                           | 5-10 min |
| `npm run builds:list`       | Ver histórico de builds                             | <1 min   |

### ADB (Android Debug Bridge)

| Script                                 | O Que Faz                     |
| -------------------------------------- | ----------------------------- |
| `npm run adb:install -- /path/app.apk` | Instala APK no celular        |
| `npm run adb:devices`                  | Lista dispositivos conectados |
| `npm run adb:logs`                     | Mostra logs do app            |

---

## 🎯 Passo a Passo

### 1️⃣ Verificar Versões

```bash
npm run validate
```

**Esperado:**

```
✓ expo: ^54.0.0
✓ react: 18.2.0
✓ react-native: 0.76.0
✓ Build type: APK (correto)
✅ Todas as versões estão corretas!
```

### 2️⃣ Gerar APK

```bash
npm run build:apk
```

**O que acontece:**

- Valida versões automaticamente
- Inicia build na nuvem EAS
- Mostra link do dashboard
- Compilação leva 5-10 minutos

### 3️⃣ Baixar APK

Opção A: Dashboard (Recomendado)

```
1. Abra: https://expo.dev/builds
2. Encontre o build (status: FINISHED)
3. Clique "Download"
4. Salve em local conhecido
```

Opção B: Terminal

```bash
# Copie o link do output do build
# Cole no navegador
https://expo.dev/builds/...
```

### 4️⃣ Conectar Celular

```bash
# Conectar via USB
# Autorizar no popup do celular

# Verificar conexão
npm run adb:devices
```

**Esperado:**

```
List of attached devices
ABC123D4567890    device
```

### 5️⃣ Instalar APK

```bash
npm run adb:install -- /caminho/para/studycycle.apk
```

**Exemplo:**

```bash
# Windows
npm run adb:install -- "C:\Users\eduar\Downloads\studycycle.apk"

# Mac/Linux
npm run adb:install -- ~/Downloads/studycycle.apk
```

**Esperado:**

```
✓ Arquivo encontrado
✓ ADB disponível
✓ Instalado com sucesso
```

---

## 🔍 Validação de Versões

O script `validate-build.js` verifica automaticamente:

✅ **Expo SDK**: 54.x (obrigatório)  
✅ **React**: 18.2.0 (exato)  
✅ **React Native**: 0.76.0 (exato)  
✅ **app.json**: Configurado para Android  
✅ **eas.json**: Profile preview com buildType APK

Se alguma versão estiver errada, o build não é iniciado.

---

## 🚨 Troubleshooting Rápido

### ❌ Validação Falha

```bash
# Ver detalhes
npm run validate

# Instalar versões corretas
npm install expo@54 react@18.2.0 react-native@0.76.0

# Tentar novamente
npm run validate
```

### ❌ ADB não funciona

```bash
# Reiniciar servidor ADB
adb kill-server
adb start-server
adb devices

# Tentar instalar de novo
npm run adb:install -- /caminho/app.apk
```

### ❌ Nenhum dispositivo encontrado

1. Desconecte e reconecte o USB
2. Ative "Modo de Desenvolvedor" no celular
3. Ative "Depuração USB"
4. Autorize a conexão no popup

---

## 📚 Documentação Completa

Para informações detalhadas, veja:

- [APK_BUILD_AND_ADB_INSTALL.md](./APK_BUILD_AND_ADB_INSTALL.md)
- [BUILD_APK_GUIDE.md](./BUILD_APK_GUIDE.md)
- [QUICK_BUILD.md](./QUICK_BUILD.md)

---

## 💡 Dicas

1. **Profile Preview vs Development**
   - Preview: Versão release, mais otimizada
   - Development: Versão debug, mais logs

2. **Reutilizar APK**
   - Salve o APK baixado
   - Instale em múltiplos celulares
   - Não precisa fazer build de novo

3. **Múltiplos Celulares**
   - Conecte vários celulares via USB
   - `npm run adb:install` instala em todos

4. **Logs em Tempo Real**
   ```bash
   npm run adb:logs
   ```

---

**Status**: ✅ Pronto | **Versão**: 1.0.0 | **Data**: 16/12/2025
