import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Card } from './ui/card';
import { Text } from './ui/text';
import { Button } from './ui/button';
import { colors, borderRadius, spacing } from '@studycycle/ui';
import { toTotalMinutes, formatDuration } from '@studycycle/core';

interface Subject {
  id: string;
  name: string;
  hours: number;
  minutes: number;
}

interface StudySettings {
  id: string;
  userId: string;
  wakeTime: string;
  sleepTime: string;
  dailyStudyHours: number;
  dailyStudyMinutes: number;
}

interface DashboardOverviewProps {
  subjects: Subject[];
  settings: StudySettings;
  totalWeeks: number;
  studyCycles?: any[];
  onNewCycle: () => void;
  onCompleteCycle?: () => void;
  style?: ViewStyle;
}

export default function DashboardOverview({
  subjects,
  settings,
  totalWeeks,
  studyCycles = [],
  onNewCycle,
  onCompleteCycle,
  style,
}: DashboardOverviewProps) {
  // Find the current/active study cycle
  const currentCycle = studyCycles.find(cycle => cycle.status === 'active') || studyCycles[0];

  const totalStudyTime = subjects.reduce((total: number, subject) => {
    return total + toTotalMinutes(subject.hours, subject.minutes);
  }, 0);

  const totalStudyHours = Math.floor(totalStudyTime / 60);
  const totalStudyMinutes = totalStudyTime % 60;

  // Calculate progress (will be implemented when completion tracking is added)
  const progress = 0;

  const styles = StyleSheet.create({
    container: {
      marginBottom: 32,
    },
    header: {
      marginBottom: 24,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    titleSection: {
      flex: 1,
      marginRight: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.neutral[900],
      marginBottom: 8,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: colors.success[100],
      borderRadius: borderRadius.full,
      alignSelf: 'flex-start',
    },
    statusDot: {
      width: 6,
      height: 6,
      backgroundColor: colors.success[500],
      borderRadius: 3,
      marginRight: 6,
    },
    statusText: {
      fontSize: 10,
      fontWeight: '600',
      color: colors.success[800],
    },
    subtitle: {
      fontSize: 14,
      color: colors.neutral[600],
    },
    buttons: {
      flexDirection: 'row',
      gap: 12,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      marginBottom: 32,
    },
    statCard: {
      flex: 1,
      minWidth: 140,
      backgroundColor: '#ffffff',
      padding: 16,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: colors.neutral[200],
      shadowColor: colors.neutral[900],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    statHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    statLabel: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.neutral[600],
    },
    statValue: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.neutral[900],
      marginTop: 4,
    },
    statIcon: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.neutral[200],
      borderRadius: borderRadius.full,
      marginTop: 12,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.success[500],
      borderRadius: borderRadius.full,
    },
  });

  const getIconBackground = (index: number) => {
    const backgrounds = [
      colors.primary[100],
      colors.secondary[100],
      colors.neutral[100],
      colors.success[100],
    ];
    return backgrounds[index] || colors.neutral[100];
  };

  const getIconColor = (index: number) => {
    const colors = [
      '#3b82f6', // primary
      '#64748b', // secondary
      '#737373', // neutral
      '#22c55e', // success
    ];
    return colors[index] || '#737373';
  };

  return (
    <ScrollView style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleSection}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={styles.title}>
                {currentCycle ? currentCycle.name || 'Ciclo Atual' : 'Ciclo Atual'}
              </Text>
              {currentCycle && (
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Ativo</Text>
                </View>
              )}
            </View>
            <Text style={styles.subtitle}>
              {currentCycle ? `Ciclo de estudos ativo - ${subjects.length} matérias` : 'Organize seus estudos'}
            </Text>
          </View>
        </View>

        <View style={styles.buttons}>
          {onCompleteCycle && subjects.length > 0 && (
            <Button
              variant="secondary"
              onPress={onCompleteCycle}
              style={{ flex: 1 }}
            >
              Completar Ciclo
            </Button>
          )}
          <Button
            onPress={onNewCycle}
            style={{ flex: 1 }}
          >
            Novo Ciclo
          </Button>
        </View>
      </View>

      <View style={styles.statsGrid}>
        {/* Total Weeks */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <View>
              <Text style={styles.statLabel}>Total de Semanas</Text>
              <Text style={styles.statValue}>{totalWeeks}</Text>
            </View>
            <View style={[styles.statIcon, { backgroundColor: getIconBackground(0) }]}>
              <Text style={{ fontSize: 24 }}>📅</Text>
            </View>
          </View>
        </View>

        {/* Subjects Count */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <View>
              <Text style={styles.statLabel}>Matérias</Text>
              <Text style={styles.statValue}>{subjects.length}</Text>
            </View>
            <View style={[styles.statIcon, { backgroundColor: getIconBackground(1) }]}>
              <Text style={{ fontSize: 24 }}>📚</Text>
            </View>
          </View>
        </View>

        {/* Daily Hours */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <View>
              <Text style={styles.statLabel}>Horas Diárias</Text>
              <Text style={styles.statValue}>
                {settings.dailyStudyHours}h {settings.dailyStudyMinutes}m
              </Text>
            </View>
            <View style={[styles.statIcon, { backgroundColor: getIconBackground(2) }]}>
              <Text style={{ fontSize: 24 }}>⏰</Text>
            </View>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <View>
              <Text style={styles.statLabel}>Progresso</Text>
              <Text style={styles.statValue}>{progress}%</Text>
            </View>
            <View style={[styles.statIcon, { backgroundColor: getIconBackground(3) }]}>
              <Text style={{ fontSize: 24 }}>📈</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.max(progress, 5)}%` }
              ]}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
