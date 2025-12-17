# 🚀 Quick Start - Build APK

## ⚡ Em 3 passos

### 1. Instale as dependências globais (primeira vez)

```bash
npm install -g eas-cli expo-cli
```

### 2. Faça login (primeira vez)

```bash
eas login
```

### 3. Gere o APK

```bash
npm run build:apk
```

## 📝 Alternativas de Build

```bash
# Build padrão (desenvolvimento)
npm run build:apk

# Build de preview (mais otimizado)
npm run build:apk:preview

# Build local (se tiver Android Studio)
npm run build:apk:local

# Ver lista de builds anteriores
npm run builds:list
```

## 📥 Instalar no Celular

Após o build ficar pronto:

### Opção A: Via Dashboard (Recomendado)

1. Abra https://expo.dev/builds
2. Baixe o APK
3. Abra no seu celular e instale

### Opção B: Via QR Code

1. Escaneie o QR code gerado no terminal
2. Toque em "Instalar"
3. Pronto!

### Opção C: Via ADB

```bash
adb install app-release.apk
```

## 📚 Documentação Completa

- [BUILD_APK_GUIDE.md](./BUILD_APK_GUIDE.md) - Guia completo
- [PREBUILD_CHECKLIST.md](./PREBUILD_CHECKLIST.md) - Verificação antes do build
- [INSTALL_ON_PHONE.md](./INSTALL_ON_PHONE.md) - Como instalar no celular

## ❓ Problemas?

### EAS não está instalado

```bash
npm install -g eas-cli
```

### Não autenticado

```bash
eas logout
eas login
```

### Dependências desatualizadas

```bash
npm install
```

### Limpar cache

```bash
npm run prebuild
```

## 🔗 Links Úteis

- [EAS Build Docs](https://docs.expo.dev/build/)
- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)

---

**Status**: ✅ Tudo configurado e pronto para build
**Última atualização**: 16/12/2025
