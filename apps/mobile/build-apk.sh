#!/bin/bash
# Script simples para gerar APK - versão bash

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  StudyCycle Mobile - APK Builder         ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Função para exibir mensagens coloridas
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

success() {
    echo -e "${GREEN}✓ $1${NC}"
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}✗ $1${NC}"
    exit 1
}

# 1. Verificar EAS CLI
info "Verificando EAS CLI..."
if ! command -v eas &> /dev/null; then
    warn "EAS CLI não encontrado. Instalando..."
    npm install -g eas-cli || error "Falha ao instalar EAS CLI"
fi
success "EAS CLI ok"

# 2. Verificar autenticação
info "Verificando autenticação EAS..."
if ! eas whoami &> /dev/null; then
    warn "Não autenticado. Faça login..."
    eas login || error "Falha ao fazer login"
fi
success "Autenticado com EAS"

# 3. Verificar dependências
info "Verificando dependências npm..."
if [ ! -d "node_modules" ]; then
    info "Instalando dependências..."
    npm install || error "Falha ao instalar dependências"
fi
success "Dependências ok"

# 4. Iniciar build
info "Iniciando build do APK..."
echo ""
eas build -p android --profile development

# 5. Sucesso
echo ""
success "Build iniciado com sucesso!"
echo ""
info "📍 Próximos passos:"
echo "   1. Abra: https://expo.dev/builds"
echo "   2. Aguarde a conclusão do build"
echo "   3. Baixe o APK ou escaneie o QR code"
echo "   4. Instale no seu celular"
echo ""
