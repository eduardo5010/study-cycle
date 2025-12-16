import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Text } from './ui/text';
import { colors, borderRadius } from '@studycycle/ui';

interface Subject {
  id: string;
  name: string;
  hours: number;
  minutes: number;
  title?: string;
  description?: string;
  modules?: any[];
  subjectTest?: any;
}

interface SubjectCardProps {
  subject: Subject;
  onSkillClick?: (skillId: string) => void;
  style?: ViewStyle;
}

export function SubjectCard({
  subject,
  onSkillClick,
  style,
}: SubjectCardProps) {
  const [expandedModule, setExpandedModule] = React.useState<string | null>(null);

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    moduleContainer: {
      marginTop: 16,
    },
    moduleItem: {
      borderWidth: 1,
      borderColor: colors.neutral[200],
      borderRadius: borderRadius.md,
      marginBottom: 8,
      overflow: 'hidden',
    },
    moduleHeader: {
      padding: 16,
      backgroundColor: colors.neutral[50],
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    moduleContent: {
      padding: 16,
    },
    skillItem: {
      padding: 8,
      marginBottom: 4,
      backgroundColor: colors.primary[50],
      borderRadius: borderRadius.sm,
    },
    skillText: {
      fontSize: 14,
      color: colors.primary[700],
    },
    testContainer: {
      marginTop: 16,
      padding: 16,
      backgroundColor: colors.error[50],
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.error[200],
    },
    testTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.error[800],
      marginBottom: 8,
    },
    testDescription: {
      fontSize: 14,
      color: colors.error[700],
    },
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  return (
    <View style={[styles.container, style]}>
      <Card>
        <CardHeader>
          <CardTitle>{subject.title || subject.name}</CardTitle>
          {subject.description && (
            <Text size="sm" color="muted" style={{ marginTop: 4 }}>
              {subject.description}
            </Text>
          )}
        </CardHeader>
        <CardContent>
          {subject.modules && subject.modules.length > 0 && (
            <ScrollView style={{ maxHeight: 400 }}>
              <View style={styles.moduleContainer}>
                {subject.modules.map((module: any, index: number) => (
                  <View key={module.id} style={styles.moduleItem}>
                    <TouchableOpacity
                      style={styles.moduleHeader}
                      onPress={() => toggleModule(module.id)}
                    >
                      <Text weight="medium">
                        Módulo {index + 1}: {module.title}
                      </Text>
                      <Text color="muted">
                        {expandedModule === module.id ? '−' : '+'}
                      </Text>
                    </TouchableOpacity>

                    {expandedModule === module.id && (
                      <View style={styles.moduleContent}>
                        {module.skills && module.skills.map((skill: any) => (
                          <TouchableOpacity
                            key={skill.id}
                            style={styles.skillItem}
                            onPress={() => onSkillClick?.(skill.id)}
                          >
                            <Text style={styles.skillText}>
                              {skill.title}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          )}

          {subject.subjectTest && (
            <View style={styles.testContainer}>
              <Text style={styles.testTitle}>Teste da Disciplina</Text>
              <Text style={styles.testDescription}>
                {subject.subjectTest.title}
              </Text>
            </View>
          )}
        </CardContent>
      </Card>
    </View>
  );
}
