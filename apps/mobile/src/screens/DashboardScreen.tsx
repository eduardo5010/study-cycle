import React, { useState } from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { colors, spacing } from '@studycycle/ui';
import Button from '../components/Button';
import Card from '../components/Card';
import Text from '../components/Text';

interface StudyCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
}

export const DashboardScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [cycles, setCycles] = useState<StudyCycle[]>([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simular carregamento
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral[50],
    },
    header: {
      padding: spacing[6],
      backgroundColor: colors.primary[600],
    },
    content: {
      padding: spacing[6],
    },
    card: {
      marginBottom: spacing[4],
    },
    cycleCard: {
      paddingVertical: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral[200],
    },
    cycleName: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.neutral[900],
      marginBottom: spacing[2],
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.neutral[200],
      borderRadius: 4,
      overflow: 'hidden',
      marginVertical: spacing[2],
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.success[500],
    },
    buttonContainer: {
      marginTop: spacing[4],
      gap: spacing[3],
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.header}>
          <Text variant="h2" color="#ffffff" weight="bold">
            Meus Ciclos
          </Text>
        </View>

        <View style={styles.content}>
          {cycles.length === 0 ? (
            <Card style={styles.card}>
              <Text align="center" color={colors.neutral[500]}>
                Nenhum ciclo criado ainda
              </Text>
            </Card>
          ) : (
            cycles.map((cycle) => (
              <Card key={cycle.id} style={styles.cycleCard}>
                <Text style={styles.cycleName}>{cycle.name}</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${cycle.progress}%` }]} />
                </View>
                <Text variant="caption" color={colors.neutral[600]}>
                  {cycle.progress}% concluído
                </Text>
              </Card>
            ))
          )}

          <View style={styles.buttonContainer}>
            <Button label="Criar Novo Ciclo" onPress={() => {}} variant="primary" size="lg" />
            <Button label="Ver Detalhes" onPress={() => {}} variant="secondary" size="lg" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
