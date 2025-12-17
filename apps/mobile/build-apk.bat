@echo off
REM Script para gerar APK no Windows

setlocal enabledelayedexpansion

echo.
echo ╔══════════════════════════════════════════╗
echo ║  StudyCycle Mobile - APK Builder         ║
echo ║  Windows Version                         ║
echo ╚══════════════════════════════════════════╝
echo.

REM Cores usando ANSI
set GREEN=[32m
set YELLOW=[33m
set RED=[31m
set BLUE=[34m
set RESET=[0m

REM Verificar Node.js
echo [94mℹ️  Verificando Node.js...%RESET%
node --version >nul 2>&1
if errorlevel 1 (
    echo [31m✗ Node.js não encontrado^
    echo   Download: https://nodejs.org/[0m
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [32m✓ Node.js %NODE_VERSION%[0m

REM Verificar npm
echo [94mℹ️  Verificando npm...%RESET%
npm --version >nul 2>&1
if errorlevel 1 (
    echo [31m✗ npm não encontrado[0m
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [32m✓ npm %NPM_VERSION%[0m

REM Verificar EAS CLI
echo [94mℹ️  Verificando EAS CLI...%RESET%
eas --version >nul 2>&1
if errorlevel 1 (
    echo [33m⚠️  EAS CLI não encontrado. Instalando...[0m
    npm install -g eas-cli
    if errorlevel 1 (
        echo [31m✗ Falha ao instalar EAS CLI[0m
        pause
        exit /b 1
    )
)
echo [32m✓ EAS CLI ok[0m

REM Verificar autenticação
echo [94mℹ️  Verificando autenticação EAS...%RESET%
eas whoami >nul 2>&1
if errorlevel 1 (
    echo [33m⚠️  Não autenticado com EAS. Fazendo login...[0m
    eas login
    if errorlevel 1 (
        echo [31m✗ Falha ao fazer login[0m
        pause
        exit /b 1
    )
)
echo [32m✓ Autenticado com EAS[0m

REM Verificar dependências
echo [94mℹ️  Verificando dependências npm...%RESET%
if not exist "node_modules" (
    echo [33m⚠️  Instalando dependências npm...[0m
    call npm install
    if errorlevel 1 (
        echo [31m✗ Falha ao instalar dependências[0m
        pause
        exit /b 1
    )
)
echo [32m✓ Dependências instaladas[0m

REM Iniciar build
echo.
echo [94mℹ️  Iniciando build do APK...[0m
echo [94m   Perfil: development[0m
echo [94m   Tipo: internal (para testes)[0m
echo.

eas build -p android --profile development

if errorlevel 1 (
    echo.
    echo [31m✗ Falha durante o build[0m
    pause
    exit /b 1
)

REM Sucesso
echo.
echo ╔══════════════════════════════════════════╗
echo ║     BUILD INICIADO COM SUCESSO!         ║
echo ╚══════════════════════════════════════════╝
echo.
echo [32m✓ APK será compilado em: https://expo.dev/builds[0m
echo.
echo [94m📍 Próximos passos:[0m
echo    1. Abra: https://expo.dev/
echo    2. Vá em "Builds"
echo    3. Encontre seu build mais recente
echo    4. Baixe o APK ou escaneie o QR code
echo    5. Instale no seu celular Android
echo.
echo [94m💡 Dica: Você pode acompanhar o build em tempo real[0m
echo    no dashboard do Expo enquanto aguarda.
echo.

pause
