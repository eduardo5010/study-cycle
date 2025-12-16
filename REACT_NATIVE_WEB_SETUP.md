# React Native Web Setup (Opcional)

## 📋 Visão Geral

Permite executar componentes React Native também na web usando `react-native-web`. Isso torna possível compartilhar 100% dos componentes entre web e mobile.

## ⚙️ Instalação

```bash
npm install --save react-native-web
npm install --save-dev @testing-library/react-native
```

## 🔧 Configuração

### 1. Vite Config (apps/web/vite.config.ts)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'client', 'src'),
      'react-native$': 'react-native-web',
      'react-native/': 'react-native-web/',
    },
  },
  // ... resto da config
});
```

### 2. Root CSS (apps/web/client/src/index.css)

```css
html,
body,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  display: flex;
}

* {
  box-sizing: border-box;
}
```

### 3. App.tsx (apps/web/client/src/App.tsx)

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from '@studycycle/mobile/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}
```

## 🚀 Usar Componentes React Native na Web

Após configurar, pode importar componentes React Native direto:

```typescript
import { View, Text, ScrollView } from 'react-native';

// Funcionará tanto na web quanto no mobile!
export function MyComponent() {
  return (
    <ScrollView>
      <View>
        <Text>Funciona em ambas!</Text>
      </View>
    </ScrollView>
  );
}
```

## 🎨 Benefícios

✅ **Compartilhamento Total de Código** - Mesmo componente em web e mobile
✅ **Consistência Visual** - Mesma aparência em ambas plataformas
✅ **Menos Duplicação** - Não precisa criar versão web e mobile
✅ **Manutenção Simplificada** - Uma codebase para tudo

## ⚠️ Limitações

❌ Alguns componentes React Native não têm equivalente web perfeito
❌ Performance pode não ser ideal em web (React Native é otimizado para mobile)
❌ Algumas features nativas não funcionam em web
❌ Debugging pode ser mais complexo

## 🚫 Quando NÃO Usar

- Quando você precisa de UI web otimizada (use HTML/CSS)
- Para aplicações com muita customização estilo
- Quando browser compat é crítico
- Para SEO importante (React Native Web não é ideal)

## ✅ Quando Usar

- Aplicações mobile-first com versão web
- Minimizar duplicação de código
- Equipe pequena que precisa manter ambas as plataformas
- Prototipar rapidamente

## 🔗 Referências

- [React Native Web Docs](https://necolas.github.io/react-native-web/)
- [Community Guides](https://github.com/necolas/react-native-web)
- [Exemplo completo](https://github.com/necolas/react-native-web/tree/master/packages/examples)
