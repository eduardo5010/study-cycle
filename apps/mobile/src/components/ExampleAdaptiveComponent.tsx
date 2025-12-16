import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { colors, spacing, responsive, borderRadius } from '@studycycle/ui';
import { useResponsive } from '@studycycle/ui';
import Button from './Button';
import Card from './Card';
import Input from './Input';

/**
 * Exemplo de componente que adapta-se à responsividade
 * Este exemplo mostra como criar interfaces que funcionam bem em todas as telas
 */
interface ExampleAdaptiveComponentProps {
  title: string;
  onClose?: () => void;
}

const ExampleAdaptiveComponent: React.FC<ExampleAdaptiveComponentProps> = ({ title, onClose }) => {
  const { width, breakpoint, isMobile, isTablet } = useResponsive();
  const [searchText, setSearchText] = React.useState('');

  // Ajusta padding baseado no tamanho da tela
  const paddingValue =
    width >= responsive.breakpoints.lg
      ? spacing[12]
      : width >= responsive.breakpoints.md
        ? spacing[8]
        : spacing[6];

  // Ajusta número de colunas
  const columns =
    width >= responsive.breakpoints.lg ? 3 : width >= responsive.breakpoints.md ? 2 : 1;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral[50],
    },
    header: {
      paddingHorizontal: paddingValue,
      paddingTop: spacing[6],
      paddingBottom: spacing[4],
      backgroundColor: colors.primary[600],
    },
    headerText: {
      color: '#ffffff',
      fontSize: width >= responsive.breakpoints.lg ? 28 : 24,
      fontWeight: '700',
      marginBottom: spacing[2],
    },
    headerSubtext: {
      color: colors.primary[100],
      fontSize: width >= responsive.breakpoints.lg ? 16 : 14,
    },
    content: {
      paddingHorizontal: paddingValue,
      paddingVertical: spacing[6],
    },
    searchSection: {
      marginBottom: spacing[6],
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -spacing[2],
    },
    gridItem: {
      width: `${100 / columns}%`,
      padding: spacing[2],
      marginBottom: spacing[4],
    },
    card: {
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.neutral[900],
      textAlign: 'center',
    },
    footer: {
      paddingHorizontal: paddingValue,
      paddingBottom: spacing[6],
      paddingTop: spacing[4],
      flexDirection: 'row',
      gap: spacing[3],
    },
    footerButton: {
      flex: 1,
    },
    responsiveInfo: {
      padding: spacing[4],
      backgroundColor: colors.primary[50],
      borderRadius: borderRadius.md,
      marginBottom: spacing[4],
    },
    responsiveInfoText: {
      fontSize: 12,
      color: colors.primary[900],
      fontFamily: 'monospace',
    },
  });

  const items = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    label: `Item ${i + 1}`,
  }));

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>{title}</Text>
          <Text style={styles.headerSubtext}>
            {isMobile ? '📱 Mobile' : isTablet ? '📱 Tablet' : '🖥️ Desktop'}
          </Text>
        </View>

        <View style={styles.content}>
          {/* Informações de Responsividade */}
          <View style={styles.responsiveInfo}>
            <Text style={styles.responsiveInfoText}>
              Breakpoint: {breakpoint} | Largura: {width}px
            </Text>
          </View>

          {/* Seção de Busca */}
          <View style={styles.searchSection}>
            <Input
              placeholder="Buscar itens..."
              value={searchText}
              onChangeText={setSearchText}
              variant="outlined"
              size="md"
            />
          </View>

          {/* Grid Adaptativo */}
          <View style={styles.gridContainer}>
            {filteredItems.map((item) => (
              <View key={item.id} style={styles.gridItem}>
                <Card style={styles.card} variant="default">
                  <Text style={styles.cardText}>{item.label}</Text>
                </Card>
              </View>
            ))}
          </View>

          {/* Footer com Ações */}
          <View style={styles.footer}>
            <View style={styles.footerButton}>
              <Button label="Ação 1" onPress={() => {}} variant="primary" size="md" />
            </View>
            {!isMobile && (
              <View style={styles.footerButton}>
                <Button label="Ação 2" onPress={() => {}} variant="secondary" size="md" />
              </View>
            )}
            {onClose && (
              <View style={styles.footerButton}>
                <Button label="Fechar" onPress={onClose} variant="outline" size="md" />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExampleAdaptiveComponent;
