import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

const ProfileScreen: React.FC = () => {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtitle}>Suas informações pessoais</Text>

        <View style={styles.profileInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.value}>{user?.name || 'Não informado'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email || 'Não informado'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Tipo de memória:</Text>
            <Text style={styles.value}>
              {user?.memoryType === 'good' ? 'Boa' :
               user?.memoryType === 'average' ? 'Média' :
               user?.memoryType === 'poor' ? 'Ruim' : 'Não avaliada'}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
  },
  profileInfo: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
  },
  infoItem: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#6b7280',
  },
});

export default ProfileScreen;
