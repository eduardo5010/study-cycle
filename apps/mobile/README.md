# 📱 StudyCycle Mobile

Aplicativo mobile React Native para o sistema StudyCycle, desenvolvido com Expo SDK 54.

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI: `npm install -g @expo/cli`
- API backend rodando (porta 3001)

### 1. Instalação

```bash
# Instalar dependências
npm install
```

### 2. Configuração da API

**⚠️ IMPORTANTE:** Configure o IP da máquina para que o app mobile possa acessar a API local.

#### Configuração Automática (Recomendado)

```bash
# Detecta automaticamente o IP da sua máquina
npm run setup-ip
```

#### Configuração Manual

Edite o arquivo `apps/mobile/.env`:

```env
# Para Android Emulator
API_URL=http://10.0.2.2:3001
API_BASE_URL=http://10.0.2.2:3001/api

# Para iOS Simulator ou dispositivo físico
API_URL=http://192.168.0.10:3001
API_BASE_URL=http://192.168.0.10:3001/api
```

> 💡 **Dica:** Substitua `192.168.0.10` pelo IP real da sua máquina na rede local.

### 3. Testar Conexão com a API

```bash
# Testa se o mobile consegue acessar a API
npm run test-api
```

### 4. Executar o App

```bash
# Iniciar o servidor de desenvolvimento
npm start

# Ou executar diretamente em uma plataforma
npm run android  # Android
npm run ios      # iOS
npm run web      # Web (para testes)
```

## 📋 Configuração por Plataforma

### 🤖 Android Emulator

- **IP:** `http://10.0.2.2:3001`
- **Por que?** O Android Emulator usa `10.0.2.2` para acessar `localhost` da máquina host

### 🍎 iOS Simulator

- **IP:** IP da máquina (ex: `192.168.0.10`)
- **Como encontrar:** Execute `ifconfig` ou `ipconfig` no terminal

### 📱 Dispositivo Físico

- **IP:** IP da máquina na mesma rede Wi-Fi
- **Permissões:** Certifique-se de que ambos dispositivos estão na mesma rede
- **Firewall:** Permita conexões na porta 3001

## 🎨 NativeWind (Tailwind CSS)

O projeto usa **NativeWind** para estilização, que é uma adaptação do Tailwind CSS para React Native.

### Configuração do CSS Global

O arquivo `global.css` na raiz do projeto contém as diretivas básicas do Tailwind:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Como Usar Classes Tailwind

```tsx
import { View, Text } from 'react-native';

export default function MyComponent() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-lg font-bold text-blue-600">
        Olá, StudyCycle!
      </Text>
    </View>
  );
}
```

### Limpeza do Cache do Metro

Quando houver problemas com estilos ou módulos, limpe o cache:

```bash
# Comando já configurado no package.json (limpa cache automaticamente)
npm start

# Ou manualmente
npx expo start --clear
```

### Desenvolvimento com Expo

```bash
# Desenvolvimento padrão (recomendado)
npm start

# Desenvolvimento específico por plataforma
npm run android    # Android com build nativo
npm run ios        # iOS com build nativo
npm run web        # Web para testes rápidos
```

### Desenvolvimento com NativeWind

- ✅ **Hot reload** funciona com classes Tailwind
- ✅ **IntelliSense** disponível no VS Code
- ✅ **Responsive design** com breakpoints
- ✅ **Dark mode** preparado

## 🏗️ Arquitetura

### Estrutura de Pastas

```
apps/mobile/
├── src/
│   ├── components/     # Componentes React Native
│   │   ├── ui/        # Componentes base (Button, Input, etc.)
│   │   └── *.native.tsx # Componentes específicos mobile
│   ├── config/        # Configurações (API, etc.)
│   ├── services/      # Serviços (API client, etc.)
│   ├── hooks/         # Hooks personalizados
│   └── types/         # Tipos TypeScript
├── scripts/           # Scripts utilitários
├── .env               # Variáveis de ambiente
└── README.md
```

### Componentes Principais

- **Header**: Navegação superior com menu lateral
- **DashboardOverview**: Visão geral com estatísticas
- **SubjectCard**: Cards expansíveis de matérias
- **SubjectList**: Lista de matérias com filtros
- **AddSubjectModal**: Modal para adicionar matérias

### API Integration

- **API Client**: Cliente HTTP configurado com retry e timeout
- **React Query**: Gerenciamento de estado server com cache
- **Environment Config**: Configuração automática por plataforma

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Iniciar Expo Dev Server (com cache limpo)
npm run android        # Executar no Android (build nativo)
npm run ios           # Executar no iOS (build nativo)
npm run web           # Executar na web

# Configuração
npm run setup-ip      # Configurar IP automaticamente
npm run test-api      # Testar conexão com API

# Build APK/AAB
npm run build:apk     # Gerar APK de desenvolvimento
npm run build:preview # Gerar APK de preview
npm run build:aab     # Gerar AAB para produção/Play Store
```

## 🌐 API Endpoints

O app se conecta aos seguintes endpoints da API:

- `GET /health` - Health check
- `GET/POST /api/subjects` - CRUD de matérias
- `GET/POST /api/study-cycles` - CRUD de ciclos de estudo
- `POST /api/sync` - Sincronização offline/online

## 🔄 Sincronização Offline/Online

O app suporta trabalho offline com sincronização automática:

- **SQLite local** para armazenamento offline
- **Sincronização automática** quando online
- **Conflito resolution** para dados conflitantes
- **Progress sync** com indicadores visuais

## 🐛 Troubleshooting

### Problemas Comuns

#### ❌ "Network request failed"

**Solução:**
1. Verifique se a API está rodando: `curl http://localhost:3001/health`
2. Execute `npm run setup-ip` para configurar o IP correto
3. Teste a conexão: `npm run test-api`

#### ❌ "Unable to resolve module"

**Solução:**
1. Limpe o cache do Metro: `npx expo start --clear`
2. Reinstale dependências: `rm -rf node_modules && npm install`

#### ❌ "Connection refused"

**Solução:**
1. Verifique se a API está na porta 3001
2. Confirme que o firewall permite conexões na porta 3001
3. Teste com IP diferente (Android: 10.0.2.2, outros: IP da máquina)

### Debug

```bash
# Ver logs detalhados
EXPO_DEBUG=true npm start

# Verificar variáveis de ambiente carregadas
console.log(process.env.API_URL);
```

## 📦 Build e Distribuição com EAS

O projeto está configurado com **EAS Build** para gerar APKs eAABs otimizados.

### Perfis de Build Disponíveis

#### 🛠️ **Desenvolvimento** (`npm run build:apk`)
- **Tipo:** APK debug
- **Distribuição:** Interna
- **Uso:** Testes em dispositivos reais
- **Comando:** `eas build -p android --profile development`

#### 👀 **Preview** (`npm run build:preview`)
- **Tipo:** APK release
- **Distribuição:** Interna
- **Uso:** Testes de QA e stakeholders
- **Comando:** `eas build -p android --profile preview`

#### 🚀 **Produção** (`npm run build:aab`)
- **Tipo:** AAB (Android App Bundle)
- **Distribuição:** Play Store
- **Uso:** Publicação na Google Play Store
- **Comando:** `eas build -p android --profile production`

### Como Instalar APK no Dispositivo

#### Opção 1: Download Direto (Recomendado)
1. Execute o build: `npm run build:apk`
2. Aguarde o build completar no EAS
3. Acesse o link do build no terminal
4. Baixe o APK diretamente no celular
5. Instale o APK

#### Opção 2: Via ADB (Desenvolvedores)
```bash
# 1. Baixar o APK do link do EAS Build
# 2. Conectar dispositivo via USB
adb devices

# 3. Instalar APK
adb install path/to/studycycle.apk

# 4. Verificar instalação
adb shell pm list packages | grep studycycle
```

### Configuração do eas.json

```json
{
  "build": {
    "development": {
      "distribution": "internal",
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleDebug"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "production": {
      "android": {
        "buildType": "aab",
        "gradleCommand": ":app:bundleRelease"
      }
    }
  }
}
```

### Dicas para Builds Bem-Sucedidos

#### ✅ **Antes do Build:**
```bash
# 1. Verificar se tudo compila
npm run type-check

# 2. Testar localmente
npm start

# 3. Limpar cache se necessário
npx expo start --clear
```

#### ✅ **Durante o Build:**
- Builds geralmente levam **10-15 minutos**
- Monitore o progresso no dashboard do EAS
- Verifique logs se houver falhas

#### ✅ **Pós-Build:**
```bash
# Ver lista de builds
npx eas-cli build:list

# Ver logs de um build específico
npx eas-cli build:view [build-id]
```

## 📱 Funcionalidades

### ✅ Implementadas

- [x] Interface responsiva mobile-first
- [x] Navegação com drawer menu
- [x] CRUD de matérias
- [x] Dashboard com estatísticas
- [x] Configuração automática de IP
- [x] Teste de conectividade API
- [x] Design system consistente

### 🚧 Em Desenvolvimento

- [ ] Autenticação JWT
- [ ] Sincronização offline/online
- [ ] Notificações push
- [ ] Upload de imagens
- [ ] Gamificação (streaks, achievements)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 🎯 Próximos Passos

1. **Testar em dispositivos reais**
2. **Implementar autenticação**
3. **Adicionar sincronização offline**
4. **Publicar nas stores**

**🚀 O StudyCycle Mobile está pronto para desenvolvimento e testes!**
