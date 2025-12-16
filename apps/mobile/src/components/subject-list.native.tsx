import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { Card } from './ui/card';
import { Text } from './ui/text';
import { colors, borderRadius, spacing } from '@studycycle/ui';

interface Subject {
  id: string;
  name: string;
  hours: number;
  minutes: number;
}

interface SubjectListProps {
  subjects: Subject[];
  style?: ViewStyle;
}

export default function SubjectList({ subjects, style }: SubjectListProps) {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#ffffff',
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: colors.neutral[200],
      shadowColor: colors.neutral[900],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.neutral[900],
    },
    count: {
      fontSize: 14,
      color: colors.neutral[600],
    },
    emptyContainer: {
      paddingVertical: 32,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: colors.neutral[500],
      textAlign: 'center',
    },
    list: {
      maxHeight: 256,
    },
    subjectItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      borderWidth: 1,
      borderColor: colors.neutral[200],
      borderRadius: borderRadius.lg,
      marginBottom: 12,
    },
    subjectLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    subjectDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 12,
    },
    subjectName: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.neutral[900],
      flex: 1,
    },
    subjectDuration: {
      fontSize: 14,
      color: colors.neutral[600],
      fontFamily: 'monospace',
    },
  });

  const getSubjectDotColor = (index: number) => {
    const colors = [
      '#3b82f6', // blue
      '#ef4444', // red
      '#22c55e', // green
      '#f59e0b', // yellow
      '#8b5cf6', // purple
      '#06b6d4', // cyan
      '#f97316', // orange
      '#84cc16', // lime
    ];
    return colors[index % colors.length];
  };

  const formatDuration = (hours: number, minutes: number) => {
    if (hours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Matérias</Text>
        <Text style={styles.count}>
          {subjects.length} {subjects.length === 1 ? 'matéria' : 'matérias'}
        </Text>
      </View>

      {subjects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhuma matéria cadastrada ainda
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {subjects.map((subject, index) => (
            <View key={subject.id} style={styles.subjectItem}>
              <View style={styles.subjectLeft}>
                <View
                  style={[
                    styles.subjectDot,
                    { backgroundColor: getSubjectDotColor(index) }
                  ]}
                />
                <Text style={styles.subjectName} numberOfLines={1}>
                  {subject.name}
                </Text>
              </View>
              <Text style={styles.subjectDuration}>
                {formatDuration(subject.hours, subject.minutes)}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
