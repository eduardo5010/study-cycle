# 🔍 Checklist de Verificação Pré-Build

Antes de executar o build, verifique todos os itens abaixo:

## ✅ Ambiente

- [ ] Node.js v18+ instalado

  ```bash
  node --version  # Deve ser v18 ou superior
  ```

- [ ] npm/yarn instalado

  ```bash
  npm --version
  ```

- [ ] EAS CLI instalado globalmente

  ```bash
  eas --version  # Deve retornar um número de versão
  ```

- [ ] Expo CLI instalado globalmente

  ```bash
  expo --version  # Deve retornar um número de versão
  ```

- [ ] Conexão com internet estável
  - Importante para compilação na nuvem

## 🔐 Autenticação

- [ ] Conta Expo criada
  - Acesse: https://expo.dev/signup

- [ ] Autenticado com EAS

  ```bash
  eas whoami  # Deve exibir seu nome de usuário
  ```

- [ ] Se não autenticado, execute:
  ```bash
  eas login
  ```

## 📦 Projeto

- [ ] Arquivo `package.json` existe

  ```bash
  ls -la package.json
  ```

- [ ] Arquivo `app.json` existe e está configurado

  ```bash
  ls -la app.json
  ```

- [ ] Arquivo `eas.json` existe e está configurado

  ```bash
  ls -la eas.json
  ```

- [ ] Pastas de assets existem
  - [ ] `assets/icon.png` (1024x1024px ou maior)
  - [ ] `assets/splash-icon.png`
  - [ ] `assets/adaptive-icon.png`

- [ ] Diretório `src/` existe com navegação
  - [ ] `src/navigation/AppNavigator.tsx`

## 📥 Dependências

- [ ] node_modules instalado

  ```bash
  npm install
  # Ou
  npm ci  # Se quiser usar o lock file
  ```

- [ ] Arquivo `package-lock.json` atualizado

  ```bash
  npm ci  # Força uso do lock file
  ```

- [ ] Versão do React Native compatível
  ```bash
  npm list react-native  # Deve ser 0.76.0 ou compatível
  ```

## 🔧 Configuração de Build

### app.json

- [ ] `expo.name` definido: `"StudyCycle"`
- [ ] `expo.slug` definido: `"studycycle-mobile"`
- [ ] `expo.version` definido: `"1.0.0"`
- [ ] `expo.android.package` definido: `"com.studycycle.mobile"`
- [ ] Ícones nos caminhos corretos

### eas.json

- [ ] Perfil `development` configurado
  ```json
  "development": {
    "distribution": "internal",
    "android": {
      "buildType": "apk",
      "gradleCommand": ":app:assembleDebug"
    }
  }
  ```

## 📱 Celular (Opcional)

Se quiser testar build local:

- [ ] Android SDK instalado (Android Studio)
- [ ] Celular conectado via USB
- [ ] Modo de desenvolvedor ativado no celular
- [ ] Autorização USB concedida

## 🚀 Pronto para Build?

Se todos os itens acima estão marcados ✓, você está pronto!

### Build Rápido

```bash
npm run build:apk
```

### Build com Preview

```bash
npm run build:apk:preview
```

### Ver lista de builds

```bash
npm run builds:list
```

---

## 🆘 Se Algo Estiver Faltando

### Instalar globalmente

```bash
npm install -g eas-cli expo-cli
```

### Reinstalar dependências

```bash
rm -rf node_modules package-lock.json
npm install
```

### Limpar cache

```bash
expo prebuild --clean
npm cache clean --force
```

### Login novamente

```bash
eas logout
eas login
```

---

**Status**: Pronto para compilação em: 16/12/2025
