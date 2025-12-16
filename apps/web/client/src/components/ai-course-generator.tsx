import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, BookOpen, Clock, Users, Star, Loader2 } from "lucide-react";

interface GeneratedCourse {
  title: string;
  description: string;
  subjects: Array<{
    title: string;
    description: string;
    modules: Array<{
      title: string;
      description: string;
      units: Array<{
        title: string;
        description: string;
        lessons: Array<{
          title: string;
          content: string;
          type: 'text' | 'video' | 'quiz';
        }>;
      }>;
    }>;
  }>;
}

export default function AICourseGenerator() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("intermediate");
  const [language, setLanguage] = useState("pt-br");
  const [generatedCourse, setGeneratedCourse] = useState<GeneratedCourse | null>(null);

  const generateCourseMutation = useMutation({
    mutationFn: async (data: { topic: string; level: string; language: string }) => {
      const response = await fetch('/api/ai/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate course');
      }

      return response.json();
    },
    onSuccess: (course) => {
      setGeneratedCourse(course);
      toast({
        title: t('ai.success'),
        description: t('ai.courseGenerated'),
      });
    },
    onError: (error) => {
      toast({
        title: t('ai.error'),
        description: t('ai.generationFailed'),
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast({
        title: t('ai.validationError'),
        description: t('ai.topicRequired'),
        variant: "destructive",
      });
      return;
    }

    generateCourseMutation.mutate({
      topic: topic.trim(),
      level,
      language,
    });
  };

  const handleSaveCourse = () => {
    // TODO: Implementar salvamento do curso gerado
    toast({
      title: t('ai.courseSaved'),
      description: t('ai.courseSavedDesc'),
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">IA Course Generator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Crie cursos completos automaticamente usando inteligência artificial.
          Basta fornecer um tópico e deixe a IA fazer o resto!
        </p>
      </div>

      {/* Formulário de Geração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Configurar Geração
          </CardTitle>
          <CardDescription>
            Defina os parâmetros para gerar seu curso personalizado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="topic">Tópico do Curso</Label>
              <Input
                id="topic"
                placeholder="Ex: Matemática Básica, História do Brasil, Programação Python..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Nível de Dificuldade</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Iniciante</SelectItem>
                  <SelectItem value="intermediate">Intermediário</SelectItem>
                  <SelectItem value="advanced">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generateCourseMutation.isPending}
            className="w-full"
            size="lg"
          >
            {generateCourseMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Gerando Curso...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Gerar Curso com IA
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resultado da Geração */}
      {generatedCourse && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{generatedCourse.title}</CardTitle>
                <CardDescription className="text-lg mt-2">
                  {generatedCourse.description}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                Gerado por IA
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Estatísticas do Curso */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">{generatedCourse.subjects.length}</div>
                <div className="text-sm text-muted-foreground">Assuntos</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-600">
                  {generatedCourse.subjects.reduce((acc, subject) =>
                    acc + subject.modules.reduce((acc2, module) =>
                      acc2 + module.units.reduce((acc3, unit) =>
                        acc3 + unit.lessons.length, 0), 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Lições</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-muted-foreground">Alunos</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                <Star className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold text-orange-600">5.0</div>
                <div className="text-sm text-muted-foreground">Avaliação</div>
              </div>
            </div>

            {/* Estrutura do Curso */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Estrutura do Curso</h3>
              {generatedCourse.subjects.map((subject, subjectIndex) => (
                <Card key={subjectIndex} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="text-lg">{subject.title}</CardTitle>
                    <CardDescription>{subject.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {subject.modules.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="pl-4 border-l-2 border-muted">
                        <h4 className="font-medium text-primary">{module.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                        <div className="space-y-1">
                          {module.units.map((unit, unitIndex) => (
                            <div key={unitIndex} className="pl-4 text-sm">
                              <span className="font-medium">{unit.title}</span>
                              <span className="text-muted-foreground ml-2">
                                ({unit.lessons.length} lições)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Ações */}
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleSaveCourse} className="flex-1">
                <BookOpen className="h-4 w-4 mr-2" />
                Salvar Curso
              </Button>
              <Button variant="outline" onClick={() => setGeneratedCourse(null)}>
                Gerar Novo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
