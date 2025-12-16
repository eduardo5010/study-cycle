import 'react-native';

// Este arquivo sobrescreve tipos conflitantes entre React e React Native
// para permitir que componentes .native.tsx funcionem corretamente

declare module 'react' {
  // Sobrescrevemos temporariamente os tipos React para compatibilidade
  // com React Native em arquivos .native.tsx
  export interface ReactNode {
    // Permite que componentes React Native sejam usados como ReactNode
  }
}

// Extensões para garantir compatibilidade
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
  }
}
