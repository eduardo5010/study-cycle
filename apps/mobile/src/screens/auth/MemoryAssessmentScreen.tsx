import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/schema';

type MemoryAssessmentScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'MemoryAssessment'>;

const MemoryAssessmentScreen: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const navigation = useNavigation<MemoryAssessmentScreenNavigationProp>();

  const questions = [
    {
      question: 'Quando você estuda um assunto, consegue se lembrar dele facilmente depois de alguns dias?',
      options: ['Sempre', 'Às vezes', 'Raramente', 'Nunca'],
    },
    {
      question: 'Você costuma revisar o conteúdo antes de provas ou testes?',
      options: ['Sempre', 'Às vezes', 'Raramente', 'Nunca'],
    },
    {
      question: 'Você consegue se lembrar de detalhes específicos de livros ou aulas antigas?',
      options: ['Muito bem', 'Bem', 'Mais ou menos', 'Pouco'],
    },
    {
      question: 'Quanto tempo você leva para aprender algo novo?',
      options: ['Pouco tempo', 'Tempo médio', 'Bastante tempo', 'Muito tempo'],
    },
  ];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate memory type based on answers
      const averageAnswer = newAnswers.reduce((sum, answer) => sum + answer, 0) / newAnswers.length;

      let memoryType: 'good' | 'average' | 'poor';
      if (averageAnswer < 1.5) {
        memoryType = 'good';
      } else if (averageAnswer < 2.5) {
        memoryType = 'average';
      } else {
        memoryType = 'poor';
      }

      // Here you would typically save this to the user profile
      // For now, just navigate back to login
      navigation.navigate('Login');
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Avaliação de Memória</Text>
          <Text style={styles.progress}>
            {currentQuestion + 1} de {questions.length}
          </Text>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.question}>{currentQ.question}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {currentQ.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(index)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.skipText}>Pular avaliação</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  progress: {
    fontSize: 16,
    color: '#6B7280',
  },
  questionContainer: {
    marginBottom: 40,
  },
  question: {
    fontSize: 18,
    lineHeight: 28,
    color: '#374151',
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  skipText: {
    fontSize: 16,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
});

export default MemoryAssessmentScreen;
