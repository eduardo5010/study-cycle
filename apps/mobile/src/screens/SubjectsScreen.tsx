import React, { useState } from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing } from '@studycycle/ui';
import Button from '../components/Button';
import Card from '../components/Card';
import Text from '../components/Text';
import Input from '../components/Input';

interface Subject {
  id: string;
  name: string;
  description: string;
  color: string;
}

export const SubjectsScreen: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral[50],
    },
    header: {
      padding: spacing[6],
      backgroundColor: colors.primary[600],
    },
    searchSection: {
      padding: spacing[6],
    },
    content: {
      paddingHorizontal: spacing[6],
    },
    subjectCard: {
      marginBottom: spacing[4],
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing[4],
    },
    colorIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: spacing[4],
    },
    subjectInfo: {
      flex: 1,
    },
    subjectName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.neutral[900],
      marginBottom: spacing[1],
    },
    subjectDescription: {
      fontSize: 14,
      color: colors.neutral[600],
    },
    actionButtons: {
      flexDirection: 'row',
      gap: spacing[2],
      marginTop: spacing[6],
    },
    deleteButton: {
      flex: 1,
    },
  });

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text variant="h2" color="#ffffff" weight="bold">
            Disciplinas
          </Text>
        </View>

        <View style={styles.searchSection}>
          <Input
            placeholder="Buscar disciplinas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            variant="outlined"
            size="md"
          />
        </View>

        <View style={styles.content}>
          {filteredSubjects.length === 0 ? (
            <Card>
              <Text align="center" color={colors.neutral[500]}>
                {searchQuery ? 'Nenhuma disciplina encontrada' : 'Nenhuma disciplina adicionada'}
              </Text>
            </Card>
          ) : (
            filteredSubjects.map((subject) => (
              <Card key={subject.id} style={styles.subjectCard} variant="outlined">
                <View style={[styles.colorIndicator, { backgroundColor: subject.color }]} />
                <View style={styles.subjectInfo}>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                  <Text style={styles.subjectDescription}>{subject.description}</Text>
                </View>
              </Card>
            ))
          )}

          <View style={styles.actionButtons}>
            <Button label="Adicionar Disciplina" onPress={() => {}} variant="primary" size="lg" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubjectsScreen;
