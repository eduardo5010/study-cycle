import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Text } from './ui/text';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { colors, borderRadius, spacing } from '@studycycle/ui';
import { createSubjectSchema } from '@studycycle/core';

interface AddSubjectModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; hours: number; minutes: number }) => Promise<void>;
}

export default function AddSubjectModal({
  isVisible,
  onClose,
  onSubmit,
}: AddSubjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    hours: 2,
    minutes: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    try {
      createSubjectSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ name: '', hours: 2, minutes: 0 });
      onClose();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar a matéria. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', hours: 2, minutes: 0 });
    setErrors({});
    onClose();
  };

  const updateFormData = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const minuteOptions = [
    { label: '00', value: 0 },
    { label: '15', value: 15 },
    { label: '30', value: 30 },
    { label: '45', value: 45 },
  ];

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    modal: {
      backgroundColor: '#ffffff',
      borderRadius: borderRadius.xl,
      padding: 16,
      width: '100%',
      maxWidth: 400,
      maxHeight: '80%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.neutral[900],
    },
    closeButton: {
      padding: 8,
    },
    closeText: {
      fontSize: 24,
      color: colors.neutral[500],
      fontWeight: '300',
    },
    form: {
      gap: 16,
    },
    timeInputs: {
      flexDirection: 'row',
      gap: 12,
    },
    timeInput: {
      flex: 1,
    },
    buttons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 16,
    },
    minuteOptions: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 8,
    },
    minuteOption: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.neutral[300],
      minWidth: 50,
      alignItems: 'center',
    },
    minuteOptionSelected: {
      backgroundColor: colors.primary[100],
      borderColor: colors.primary[500],
    },
    minuteOptionText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.neutral[700],
    },
    minuteOptionTextSelected: {
      color: colors.primary[700],
    },
  });

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Adicionar Matéria</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ gap: 16 }}>
              <Input
                label="Nome da Matéria"
                placeholder="Ex: Matemática"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                error={errors.name}
              />

              <Input
                label="Horas por dia"
                placeholder="2"
                value={formData.hours.toString()}
                onChangeText={(value) => updateFormData('hours', parseInt(value) || 0)}
                keyboardType="numeric"
                error={errors.hours}
              />

              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', color: colors.neutral[700], marginBottom: 8 }}>
                  Minutos
                </Text>
                <View style={styles.minuteOptions}>
                  {minuteOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.minuteOption,
                        formData.minutes === option.value && styles.minuteOptionSelected,
                      ]}
                      onPress={() => updateFormData('minutes', option.value)}
                    >
                      <Text
                        style={[
                          styles.minuteOptionText,
                          formData.minutes === option.value && styles.minuteOptionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.buttons}>
              <Button
                variant="outline"
                onPress={handleClose}
                style={{ flex: 1 }}
              >
                Cancelar
              </Button>
              <Button
                onPress={handleSubmit}
                isLoading={isSubmitting}
                style={{ flex: 1 }}
              >
                {isSubmitting ? 'Adicionando...' : 'Adicionar'}
              </Button>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
