# 📱 Guia de Instalação no Celular

## 🎯 Métodos de Instalação do APK

Existem 3 formas principais de instalar o APK compilado no seu celular Android:

---

## Método 1️⃣: Via Dashboard Expo (Mais Fácil)

### Passo 1: Acessar o Dashboard

1. Abra: https://expo.dev/
2. Faça login com sua conta
3. Clique em **"Builds"** no menu lateral

### Passo 2: Encontrar seu Build

1. Localize o build mais recente na lista
2. Procure pelo status **"FINISHED"** (verde)
3. Você verá a data e hora do build

### Passo 3: Baixar o APK

1. Clique no build de sua escolha
2. Clique no botão **"Download"** para o APK
3. Salve o arquivo no seu celular

### Passo 4: Instalar

1. Abra o arquivo `.apk` no seu celular
2. Toque em **"Instalar"**
3. Se solicitado, autorize a instalação de fontes desconhecidas
4. Aguarde a conclusão

---

## Método 2️⃣: Via QR Code (Mais Rápido)

### Passo 1: Obter o QR Code

1. Após o build ser concluído no terminal, você verá um QR code
2. Se perder, acesse: https://expo.dev/builds
3. Encontre seu build e clique em "QR code"

### Passo 2: Escanear

1. Abra a **Câmera** do seu celular
2. Aponte para o QR code no monitor
3. Toque no link que aparecer

### Passo 3: Instalar

1. Toque em **"Instalar App"**
2. Aguarde o download completar
3. O app será aberto automaticamente

---

## Método 3️⃣: Via ADB (Android Debug Bridge)

### Pré-requisitos

- Android SDK/Android Studio instalado
- Celular conectado via USB
- Modo desenvolvedor ativado

### Passo 1: Ativar Modo Desenvolvedor

1. Abra **Configurações**
2. Vá para **Sobre o Telefone**
3. Localize **"Número de Compilação"**
4. Toque 7 vezes seguidas nele
5. Agora você tem acesso ao **Modo Desenvolvedor**

### Passo 2: Ativar Depuração USB

1. Volte para **Configurações**
2. Vá para **Desenvolvedor** (nova seção)
3. Ative **"Depuração USB"**
4. Toque em **"OK"** para confirmar

### Passo 3: Conectar Celular

1. Conecte o celular ao PC via USB
2. Uma caixa de diálogo deve aparecer no celular
3. Toque em **"Permitir"** para autorizar a conexão

### Passo 4: Verificar Conexão

```bash
adb devices
```

Você deve ver algo como:

```
List of attached devices
ABC123D4567890    device
```

### Passo 5: Instalar o APK

```bash
adb install C:\caminho\para\studycycle-mobile.apk
```

Se tudo correr bem, você verá:

```
Success
```

### Passo 6: Abrir o App

```bash
adb shell am start -n com.studycycle.mobile/.MainActivity
```

---

## Método 4️⃣: Via Transferência de Arquivo

### Windows

1. Conecte o celular via USB
2. Na janela do Explorador, selecione o celular
3. Vá para a pasta **Downloads** ou **Documentos**
4. Arraste o arquivo `.apk` para lá
5. Abra o arquivo no celular e instale

### Mac/Linux

```bash
# Copiar para o celular (se suportado)
adb push /caminho/local/apk /sdcard/Download/
# Depois abra o arquivo no celular
```

---

## ⚙️ Preparar o Celular

### Antes da Primeira Instalação

#### Android 12 ou Superior

1. **Configurações** → **Aplicativos**
2. **Permissões** → **Permissões de Aplicação**
3. Verifique se o app tem permissões necessárias:
   - ✓ Internet
   - ✓ Acesso a Arquivos
   - ✓ Câmera (opcional)
   - ✓ Microfone (opcional)

#### Permitir Instalação de Fontes Desconhecidas

1. **Configurações** → **Aplicativos** (ou **Segurança**)
2. Procure por **"Instalar Aplicativos Desconhecidos"**
3. Selecione o **Gerenciador de Arquivos** ou **Navegador** (aquele que você usa para abrir o APK)
4. Ative a permissão

---

## 🧪 Testando o App

### Após Instalação

1. ✓ Procure pelo ícone **StudyCycle** na tela inicial
2. ✓ Toque para abrir
3. ✓ A tela de carregamento deve aparecer
4. ✓ Você deve ver a tela de login/home

### Teste os Fluxos Principais

- [ ] **Login**: Se houver, teste com credenciais
- [ ] **Navegação**: Navegue entre as telas
- [ ] **Dados Offline**: Desconecte a internet e teste
- [ ] **Sincronização**: Conecte de novo e teste sync
- [ ] **Funcionalidades**: Teste as principais funcionalidades

### Verificar Logs (Avançado)

```bash
# Ver logs em tempo real
adb logcat | grep StudyCycle

# Ou apenas os últimos 50 logs
adb logcat -t 50 | grep StudyCycle
```

---

## 🐛 Problemas Comuns e Soluções

### ❌ "App não instala"

- ✓ Verifique se tem espaço em disco
- ✓ Tente desinstalar versão anterior: `adb uninstall com.studycycle.mobile`
- ✓ Reinicie o celular

### ❌ "Erro de permissões"

- ✓ Ative "Instalar aplicativos desconhecidos"
- ✓ Desative controles parentais se houver

### ❌ "App congela ao abrir"

- ✓ Limpe cache: Configurações → Aplicativos → StudyCycle → Armazenamento → Limpar Cache
- ✓ Desinstale e reinstale

### ❌ "ADB não encontra o celular"

```bash
# Reiniciar ADB
adb kill-server
adb start-server
adb devices
```

### ❌ "Build não aparece no dashboard"

- ✓ Aguarde 2-3 minutos
- ✓ Atualize a página
- ✓ Verifique se está logado na conta correta

---

## 📊 Versions e Compatibilidade

### Versões Testadas

- ✓ Android 8.0+ (API 26+)
- ✓ Dispositivos com 512MB+ RAM
- ✓ Telas de 4.7" a 6.5"

### Requisitos Mínimos

- **Android**: 8.0 (API 26)
- **RAM**: 512MB
- **Armazenamento**: 50MB livres
- **Tela**: Qualquer resolução

---

## 📞 Suporte

Se encontrar problemas:

1. **Verificar Logs**

   ```bash
   adb logcat > logs.txt
   ```

2. **Desinstalar Completamente**

   ```bash
   adb uninstall com.studycycle.mobile
   ```

3. **Reinstalar do Dashboard**
   - Acesse: https://expo.dev/builds
   - Baixe a versão mais recente

4. **Reportar Problema**
   - Compartilhe os logs
   - Descreva o dispositivo e versão do Android
   - Anexe prints de tela

---

**Última atualização**: 16 de dezembro de 2025
**Aplicativo**: StudyCycle Mobile v1.0.0
**Status**: ✅ Pronto para instalação
