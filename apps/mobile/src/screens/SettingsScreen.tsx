import React from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing } from '@studycycle/ui';
import Button from '../components/Button';
import Card from '../components/Card';
import Text from '../components/Text';

export const SettingsScreen: React.FC = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral[50],
    },
    header: {
      padding: spacing[6],
      backgroundColor: colors.primary[600],
    },
    section: {
      padding: spacing[6],
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral[200],
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.neutral[900],
      marginBottom: spacing[4],
    },
    setting: {
      marginBottom: spacing[4],
    },
    settingLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.neutral[900],
      marginBottom: spacing[1],
    },
    settingDescription: {
      fontSize: 13,
      color: colors.neutral[600],
    },
    buttonGroup: {
      marginTop: spacing[6],
      gap: spacing[3],
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text variant="h2" color="#ffffff" weight="bold">
            Configurações
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>
          <View style={styles.setting}>
            <Text style={styles.settingLabel}>Lembres de Estudo</Text>
            <Text style={styles.settingDescription}>Receba notificações de ciclos e metas</Text>
          </View>
          <View style={styles.setting}>
            <Text style={styles.settingLabel}>Som e Vibração</Text>
            <Text style={styles.settingDescription}>Ativar som e vibração nas notificações</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aparência</Text>
          <View style={styles.setting}>
            <Text style={styles.settingLabel}>Tema</Text>
            <Text style={styles.settingDescription}>Escolha entre claro, escuro ou automático</Text>
          </View>
          <View style={styles.setting}>
            <Text style={styles.settingLabel}>Tamanho de Fonte</Text>
            <Text style={styles.settingDescription}>Ajuste o tamanho da fonte do aplicativo</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          <View style={styles.buttonGroup}>
            <Button label="Editar Perfil" onPress={() => {}} variant="primary" size="md" />
            <Button label="Redefinir Senha" onPress={() => {}} variant="secondary" size="md" />
            <Button label="Sair" onPress={() => {}} variant="outline" size="md" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
